import { siteConfig } from '../../site-config.js';

const shots = [
  {id:'center',src:'./images/p08-1.png',title:'智能体中心入口',page:8,alt:'智能体中心与各业务入口'},
  {id:'upload',src:'./images/p11-0.png',title:'上传单证，开始智能处理',page:11,alt:'原方案的单证上传界面',description:'支持扫描件、PDF 与邮件附件等形式，将多来源单证统一送入后续识别与制单工作流。'},
  {id:'recognize',src:'./images/p12-0.png',title:'识别进度与处理状态可见',page:12,alt:'原方案的 OCR 识别与处理进度界面',description:'展示文件解析、OCR 识别、语义理解、字段提取和校验等处理阶段，便于业务人员了解当前状态。'},
  {id:'extract',src:'./images/p13-0.png',title:'抽取关键字段，匹配业务语义',page:13,alt:'原方案的 OCR 结果与字段提取界面',description:'从 OCR 内容中抽取客户、仓库、货物、数量和结算方式等关键字段，结合领域知识与规则辅助映射。'},
  {id:'confirm',src:'./images/p14-0.png',title:'核对业务字段，确认制单信息',page:14,alt:'原方案的基本信息与货物明细确认界面',description:'业务人员核对基本信息和货物明细，结合校验结果修改字段，确认后发起制单。'},
  {id:'complete',src:'./images/p15-0.png',title:'制单完成，保留结果与处理记录',page:15,alt:'原方案的制单完成及处理结果界面',description:'展示制单完成状态与结果信息，衔接后续业务处理。截图中的识别率和耗时等数值为界面示例，不作为实际验收数据。'},
  {id:'system',src:'./images/p16-0.png',title:'进入业务系统，查询与追溯',page:16,alt:'原方案的供应链系统单据列表截图',description:'经质检合格的信息回填至供应链系统，结合单据列表和历史记录支持后续查询与业务对照。'}
];
const byId = id => document.getElementById(id);
const syncTabOrientation=()=>document.querySelector('[role=tablist]').setAttribute('aria-orientation',matchMedia('(max-width:740px)').matches?'horizontal':'vertical');
syncTabOrientation();matchMedia('(max-width:740px)').addEventListener('change',syncTabOrientation);
const steps=shots.slice(1), tabs=[...document.querySelectorAll('[data-step]')];
function selectStep(index,focus=false){const s=steps[index];tabs.forEach((t,i)=>{t.setAttribute('aria-selected',String(i===index));t.tabIndex=i===index?0:-1});byId('screen-title').textContent=s.title;byId('screen-source').textContent=`原 PDF 第 ${s.page} 页`;byId('screen-image').src=s.src;byId('screen-image').alt=s.alt;byId('screen-description').textContent=s.description;byId('screen-zoom').dataset.image=s.id;byId('screen-zoom').setAttribute('aria-label',`放大查看${s.alt}`);byId('screen-panel').setAttribute('aria-labelledby',tabs[index].id);if(focus){tabs[index].focus();tabs[index].scrollIntoView({block:"nearest",inline:"nearest",behavior:"instant"})}}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectStep(i));tab.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();selectStep(next,true)})});
let activeImage=0,returnFocus;
const dialog=byId('lightbox');
function paintLightbox(){const s=shots[activeImage];byId('lightbox-image').src=s.src;byId('lightbox-image').alt=s.alt;byId('lightbox-title').textContent=s.title;byId('lightbox-caption').textContent=`${activeImage+1} / ${shots.length} · 原 PDF 第 ${s.page} 页 · 原方案截图，界面数值为示例`}
document.querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>{returnFocus=b;activeImage=shots.findIndex(s=>s.id===b.dataset.image);paintLightbox();dialog.showModal();document.body.classList.add('lock')}));
byId('close-lightbox').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('lock');returnFocus?.focus()});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
function moveImage(delta){activeImage=(activeImage+delta+shots.length)%shots.length;paintLightbox()}
byId('previous-image').addEventListener('click',()=>moveImage(-1));byId('next-image').addEventListener('click',()=>moveImage(1));dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();moveImage(-1)}if(e.key==='ArrowRight'){e.preventDefault();moveImage(1)}});
byId('copy-wechat').addEventListener('click',async()=>{let copied=false;try{await navigator.clipboard.writeText(siteConfig.contactWechat);copied=true}catch{const t=document.createElement('textarea');t.value=siteConfig.contactWechat;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();copied=document.execCommand('copy');t.remove()}byId('toast').textContent=copied?`微信号已复制：${siteConfig.contactWechat}`:`微信号：${siteConfig.contactWechat}`;byId('toast').hidden=false;setTimeout(()=>byId('toast').hidden=true,2400)});
byId('print-page').addEventListener('click',()=>window.print());

const emailLink=byId('case-email');
if(siteConfig.contactEmail){emailLink.href=`mailto:${siteConfig.contactEmail}`;emailLink.textContent=siteConfig.contactEmail;emailLink.hidden=false}
byId('case-wechat').textContent=siteConfig.contactWechat || '待补充';
byId('copy-wechat').hidden=!siteConfig.contactWechat;
document.querySelectorAll('[data-legal-entity]').forEach(el=>el.textContent=siteConfig.legalEntity || '鲸浪创新工坊');
