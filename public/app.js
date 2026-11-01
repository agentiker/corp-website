import { siteConfig } from './site-config.js';

document.documentElement.classList.add('js');

const icon = (name) => {
  const paths = {
    arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
    right: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    down: '<path d="M12 4v16m-6-6 6 6 6-6"/>',
    up: '<path d="M12 20V4m-6 6 6-6 6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  };
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] ?? paths.arrow}</svg>`;
};

// These templates contain authored demonstration data only. Visitor input is
// written into textarea.value and is never interpolated into HTML.
const steps = [
  {
    title: '先把“好客户”定义清楚',
    description: 'Agent 根据业务员提供的市场、货品和服务范围，整理筛选条件。业务判断从这里开始。',
    role: '业务员 + Agent',
    responsibility: '业务员确定目标，Agent 整理条件。',
    canvas: `<div class="canvas-heading">本次客户开发目标<span class="canvas-caption">示例任务</span></div><dl class="target-lines"><div><dt>目标市场</dt><dd>英国</dd></div><div><dt>关注货品</dt><dd>家具与家居用品</dd></div><div><dt>采购特征</dt><dd>关注从中国进口的采购商</dd></div><div><dt>业务目标</dt><dd>整理潜在线索，准备首次沟通</dd></div></dl><p class="canvas-note">${icon('info')}实际筛选条件由业务员确认，数据范围取决于授权与来源。</p>`,
  },
  {
    title: '先看匹配依据，再看名单',
    description: '按确认的条件整理潜在采购商，同时列出匹配理由与缺失信息，供业务员进一步判断。',
    role: 'Agent 整理 · 业务员判断',
    responsibility: '名单只是起点，匹配依据需要检查。',
    canvas: `<div class="canvas-heading">潜在采购商<span class="canvas-caption">全部为虚构示例</span></div><table class="lead-table"><caption class="sr-only">示例采购商的业务匹配依据与核实状态</caption><thead><tr><th scope="col">采购商</th><th scope="col">匹配依据</th><th scope="col">状态</th></tr></thead><tbody><tr><td>示例采购商 A<span class="table-subtitle">英国 · 家具</span></td><td>货品与目标相符</td><td><span class="table-tag">待核实</span></td></tr><tr><td>示例采购商 B<span class="table-subtitle">英国 · 家居</span></td><td>品类相关，信息不足</td><td><span class="table-tag table-tag-wait">需补充</span></td></tr><tr><td>示例采购商 C<span class="table-subtitle">英国 · 综合贸易</span></td><td>主营业务待确认</td><td><span class="table-tag table-tag-wait">待判断</span></td></tr></tbody></table><p class="canvas-note">${icon('info')}这里不连接真实贸易数据库，也不代表联系方式可用。</p>`,
  },
  {
    title: '让每条线索都能被检查',
    description: '将企业信息、匹配理由、信息来源和待办事项整理在一起，减少业务员来回查找。',
    role: 'Agent 汇总 · 业务员核实',
    responsibility: '保留信息来源，明确不确定的部分。',
    canvas: `<div class="canvas-heading">线索档案<span class="canvas-caption">虚构企业 · 结构示例</span></div><div class="lead-detail"><div class="lead-detail-header"><span class="company-avatar" aria-hidden="true">A</span><div><strong>示例采购商 A</strong><p>英国 · 家具进口业务（示例）</p></div></div><ul class="detail-list"><li><span>关注货品</span><span>家具与家居用品</span></li><li><span>匹配理由</span><span>品类与目标一致，仍需核实</span></li><li><span>信息来源</span><span>实际使用时记录授权来源</span></li><li><span>联系人</span><span>待核实，不猜测联系方式</span></li><li><span>建议下一步</span><span>核实业务范围与联系人</span></li></ul></div><p class="canvas-note">${icon('info')}未知信息明确标记，交给后续核实。</p>`,
  },
  {
    title: '沟通内容，先由 AI 打个底',
    description: '结合已核实的业务信息准备邮件草稿，供业务员修改。运价、时效与服务承诺需要人工确认。',
    role: 'Agent 草拟 · 业务员修改',
    responsibility: '未核实的信息与承诺不进入正式邮件。',
    canvas: `<div class="canvas-heading">首次沟通草稿<span class="canvas-caption">邮件内容示例</span></div><div class="email-preview" lang="en"><div class="email-subject"><strong>Subject:</strong> A conversation about your China–UK shipments</div><p>Hello [verified contact],</p><p>We would like to understand your current shipping needs from China to the UK and see whether our services could be a fit.</p><p>Would you be open to a brief conversation about your upcoming shipments?</p><div class="email-stamp" lang="zh-CN">${icon('info')}草稿待审核 · 不会自动发送</div></div>`,
  },
  {
    title: '关键动作，把决定权留给人',
    description: '业务员核实对象、内容与服务范围，再决定是否联系。把人机分工落到具体操作上。',
    role: '业务员确认',
    responsibility: '演示止于审核环节，不执行外部操作。',
    canvas: `<div class="canvas-heading">发送前审核<span class="canvas-caption">审核事项示例</span></div><div class="review-checklist"><div><span class="review-box" aria-hidden="true"></span>采购商与业务范围已核实</div><div><span class="review-box" aria-hidden="true"></span>联系人与联系方式已确认</div><div><span class="review-box" aria-hidden="true"></span>邮件内容与服务描述已审核</div><div><span class="review-box" aria-hidden="true"></span>本次触达符合适用要求</div></div><div class="review-footer"><span>演示流程到此结束</span><span class="review-hold">等待人工决策</span></div>`,
  },
];

const tabs = [...document.querySelectorAll('.demo-tab')];
const panel = document.querySelector('#workflow-panel');
const nextButton = document.querySelector('#next-step');
let currentStep = 0;
const announcement = document.createElement('p');
announcement.className = 'sr-only';
announcement.setAttribute('role', 'status');
announcement.setAttribute('aria-live', 'polite');
panel.after(announcement);

function renderStep(index, announce = true) {
  currentStep = index;
  const step = steps[index];
  tabs.forEach((tab, position) => {
    tab.setAttribute('aria-selected', String(index === position));
    tab.tabIndex = index === position ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tabs[index].id);
  document.querySelector('#demo-step-title').textContent = step.title;
  document.querySelector('#demo-step-description').textContent = step.description;
  document.querySelector('#demo-role').textContent = step.role;
  document.querySelector('#demo-role-description').textContent = step.responsibility;
  document.querySelector('#demo-canvas').innerHTML = step.canvas;
  const nextLabel = index === steps.length - 1 ? '重新查看流程' : `下一步：${tabs[index + 1].textContent.slice(2).trim()}`;
  nextButton.innerHTML = `${nextLabel} ${icon('right')}`;
  if (announce) announcement.textContent = `步骤 ${index + 1}，${step.title}`;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderStep(index));
  tab.addEventListener('keydown', (event) => {
    const target = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    renderStep(target);
    tabs[target].focus();
    tabs[target].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  });
});
nextButton.addEventListener('click', () => renderStep((currentStep + 1) % steps.length));
renderStep(0, false);

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu(restoreFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '打开导航菜单');
  nav.classList.remove('is-open');
  if (restoreFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true); });
document.addEventListener('click', (event) => { if (!event.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 721px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('main section[id]')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      nav.querySelectorAll('a').forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px' });
  sections.forEach((section) => observer.observe(section));
}

const form = document.querySelector('#brief-form');
const scenarioInput = document.querySelector('#brief-scenario');
const result = document.querySelector('#brief-result');
const output = document.querySelector('#brief-output');
const copyButton = document.querySelector('#copy-brief');
const copyStatus = document.querySelector('#copy-status');
scenarioInput.addEventListener('input', () => scenarioInput.setCustomValidity(''));

document.querySelectorAll('[data-interest]').forEach((link) => link.addEventListener('click', () => {
  const input = [...form.elements.interest].find((radio) => radio.value === link.dataset.interest);
  if (input) input.checked = true;
  form.hidden = false;
  result.hidden = true;
}));

// Only explicitly configured public contacts enable an external contact action.
const email = typeof siteConfig.contactEmail === 'string' && /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?\.[A-Z]{2,}$/i.test(siteConfig.contactEmail) ? siteConfig.contactEmail : '';
let wecomUrl = '';
try {
  const parsed = new URL(siteConfig.wecomUrl);
  if (parsed.protocol === 'https:' && !parsed.username && !parsed.password) wecomUrl = parsed.href;
} catch { /* Empty or invalid contact configuration leaves the entry disabled. */ }

if (email || wecomUrl) {
  document.querySelector('#contact-channel').hidden = true;
  document.querySelector('#configured-contact').hidden = false;
}
if (email) {
  const emailLink = document.querySelector('#email-link');
  emailLink.href = `mailto:${email}`;
  emailLink.hidden = false;
}
if (wecomUrl) {
  const wecomLink = document.querySelector('#wecom-link');
  wecomLink.href = wecomUrl;
  wecomLink.hidden = false;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const scenario = scenarioInput.value.trim();
  if (!scenario) {
    scenarioInput.setCustomValidity('请描述一个你希望解决的工作问题。');
    scenarioInput.reportValidity();
    return;
  }
  const values = new FormData(form);
  const name = String(values.get('name') ?? '').trim();
  const company = String(values.get('company') ?? '').trim();
  output.value = [
    '鲸浪创新工坊 · 业务沟通提纲', '',
    `关注方向：${values.get('interest')}`,
    `称呼：${name || '待补充'}`,
    `公司 / 团队：${company || '待补充'}`, '',
    '最想解决的工作问题：', scenario, '',
    '建议沟通时补充：',
    '1. 目前由谁操作，流程如何完成？',
    '2. 最耗时或最容易出错的环节是什么？',
    '3. 涉及哪些数据和业务系统？',
    '4. 哪些动作必须由人审核？',
    '5. 希望用什么结果判断试点是否有价值？',
  ].join('\n');
  if (email) {
    const mailLink = document.querySelector('#email-brief');
    mailLink.hidden = false;
    mailLink.href = `mailto:${email}?subject=${encodeURIComponent('业务场景沟通｜鲸浪创新工坊')}&body=${encodeURIComponent(output.value)}`;
  }
  copyStatus.textContent = '';
  form.hidden = true;
  result.hidden = false;
  output.focus();
});

copyButton.addEventListener('click', async () => {
  copyStatus.textContent = '';
  if (!navigator.clipboard?.writeText) {
    selectBriefForManualCopy();
    return;
  }
  copyButton.disabled = true;
  try {
    await navigator.clipboard.writeText(output.value);
    copyStatus.textContent = '提纲已复制，可以粘贴给项目联系人。';
  } catch {
    selectBriefForManualCopy();
  } finally {
    copyButton.disabled = false;
  }
});

function selectBriefForManualCopy() {
  output.focus();
  output.select();
  copyStatus.textContent = '未能自动复制，已选中提纲。请使用系统复制功能，或下载文本。';
}

document.querySelector('#download-brief').addEventListener('click', () => {
  const file = new Blob(['\uFEFF', output.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = '鲸浪创新工坊-业务沟通提纲.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.querySelector('#edit-brief').addEventListener('click', () => {
  result.hidden = true;
  form.hidden = false;
  scenarioInput.focus();
});

document.querySelector('#copyright-year').textContent = String(new Date().getFullYear());
const legalDetails = document.querySelector('#legal-details');
if (siteConfig.legalEntity || siteConfig.icpNumber) {
  legalDetails.textContent = [siteConfig.legalEntity, siteConfig.icpNumber].filter(Boolean).join(' · ');
  legalDetails.hidden = false;
}
