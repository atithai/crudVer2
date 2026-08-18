const API_URL="https://script.google.com/macros/s/AKfycbyGnqEJzErTo-TvGAVOyXprVs3NJp5d1BRVuJ0g37kcbtJKthf2CXR_zxBBMf_y8Mw_/exec",MAX=5*1024*1024,$=x=>document.getElementById(x);
function esc(x){return String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function img(id){return id?`https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w300`:""}
async function api(a,b=null)
{if(API_URL.includes("PASTE_"))throw Error("กรุณาใส่ Web App URL ใน app.js");
    let u=new URL(API_URL);u.searchParams.set("action",a);let o=b?{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(b)}:{};
    let d=await (await fetch(u,o)).json();if(!d.ok)throw Error(d.error);return d}
async function load(){try{let d=await api("list");$("t").innerHTML=d.data.map(x=>`<tr><td>${x.imageFileId?`
    <img class="thumb" src="${esc(img(x.imageFileId))}">`:"-"}</td><td>${esc(x.id)}</td><td>${esc(x.name)}</td><td>${esc(x.age)}</td>
    <td><button onclick='edit(${JSON.stringify(x)})'>แก้ไข</button> <button class="danger" onclick='del(${x.row})'>ลบ</button></td></tr>`).join("");$("status").textContent=`ข้อมูล ${d.data.length} รายการ`}catch(e){$("status").textContent=e.message}}
window.edit=x=>{$("row").value=x.row;$("old").value=x.imageFileId||"";$("id").value=x.id;$("name").value=x.name;$("age").value=x.age;$("image").value="";$("preview").innerHTML=x.imageFileId?`<img class="thumb" src="${esc(img(x.imageFileId))}">`:""};
window.del=async row=>{if(!confirm("ลบข้อมูลและรูปภาพหรือไม่?"))return;try{await api("delete",{row});load()}catch(e){$("status").textContent=e.message}};
$("image").onchange=()=>{let f=$("image").files[0];if(f&&f.size>MAX){$("image").value="";$("status").textContent="รูปต้องไม่เกิน 5 MB";return}if(f){let r=new FileReader();r.onload=()=>{$("preview").innerHTML=`<img class="thumb" src="${r.result}">`};r.readAsDataURL(f)}};
$("f").onsubmit=async e=>{e.preventDefault();try{let f=$("image").files[0],b64=null;
    if(f){let d=await new Promise((ok,no)=>{let r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(f)});b64=d.split(",")[1]}await api($("row").value?"update":"create",
    {row:$("row").value,id:$("id").value.trim(),name:$("name").value.trim(),age:$("age").value,oldImageFileId:$("old").value,imageBase64:b64,imageName:f?.name||"",imageMimeType:f?.type||""});$("f").reset();$("row").value="";$("old").value="";$("preview").innerHTML="";load()}
catch(e){$("status").textContent=e.message}};
$("cancel").onclick=()=>{$("f").reset();$("row").value="";$("old").value="";$("preview").innerHTML=""};load();
