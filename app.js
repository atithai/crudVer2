const API_URL="https://script.google.com/macros/s/AKfycby8Sf50WMp-m8IaTnBzvxcEOxXTwvoQI6kZfFD2V_qzcWhlZGIXrzAt1ToRl8RPNu95/exec";
const $=id=>document.getElementById(id), form=$("studentForm"), statusEl=$("status"), tableBody=$("tableBody");
function status(m){statusEl.textContent=m}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function imgUrl(id){return id?`https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w300`:""}
async function api(action,body=null){
 if(API_URL.includes("PASTE_YOUR"))throw Error("กรุณาใส่ Web App URL ใน app.js");
 const u=new URL(API_URL);u.searchParams.set("action",action);
 const o=body?{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(body)}:{};
 const r=await fetch(u,o),d=await r.json();if(!d.ok)throw Error(d.error||"API error");return d
}
async function load(){try{status("กำลังโหลด...");const r=await api("list");tableBody.innerHTML=r.data.map(x=>`<tr><td>${x.imageFileId?`<img class="thumb" src="${esc(imgUrl(x.imageFileId))}" alt="">`:"-"}</td><td>${esc(x.id)}</td><td>${esc(x.name)}</td><td>${esc(x.age)}</td><td><button onclick='editRow(${JSON.stringify(x)})'>แก้ไข</button> <button class="danger" onclick='removeRow(${Number(x.row)})'>ลบ</button></td></tr>`).join("");status(`ข้อมูล ${r.data.length} รายการ`)}catch(e){status(e.message)}}
window.editRow=x=>{$("row").value=x.row;$("oldImageFileId").value=x.imageFileId||"";$("id").value=x.id;$("name").value=x.name;$("age").value=x.age;$("image").value="";$("preview").innerHTML=x.imageFileId?`<img src="${esc(imgUrl(x.imageFileId))}">`:"";scrollTo({top:0,behavior:"smooth"})};
window.removeRow=async row=>{if(!confirm("ลบข้อมูลและรูปภาพใน Drive หรือไม่?"))return;try{status("กำลังลบ...");await api("delete",{row});await load()}catch(e){status(e.message)}};
$("image").onchange=()=>{const f=$("image").files[0];if(!f){$("preview").innerHTML="";return}const r=new FileReader();r.onload=()=>{$("preview").innerHTML=`<img src="${r.result}">`};r.readAsDataURL(f)};
form.onsubmit=async e=>{e.preventDefault();try{status("กำลังเตรียมรูปภาพ...");const f=$("image").files[0];let b64=null;if(f){const d=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)});b64=d.split(",")[1]}const p={row:$("row").value,id:$("id").value.trim(),name:$("name").value.trim(),age:$("age").value,oldImageFileId:$("oldImageFileId").value,imageBase64:b64,imageName:f?f.name:"",imageMimeType:f?f.type:""};await api(p.row?"update":"create",p);form.reset();$("row").value="";$("oldImageFileId").value="";$("preview").innerHTML="";await load()}catch(e){status(e.message)}};
$("cancelBtn").onclick=()=>{form.reset();$("row").value="";$("oldImageFileId").value="";$("preview").innerHTML=""};$("reloadBtn").onclick=load;load();
