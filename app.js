document.getElementById('year').textContent = new Date().getFullYear();
const menuToggle=document.getElementById('menuToggle');const nav=document.getElementById('nav');
menuToggle?.addEventListener('click',()=>nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const whatsapp='5531993177883';
const msg=encodeURIComponent('Olá! Conheci a PLAY TV pelo portal e gostaria de saber mais sobre o plano mensal de R$ 35, os conteúdos disponíveis e os dispositivos compatíveis.');
document.getElementById('whatsappLink').href=`https://wa.me/${whatsapp}?text=${msg}`;
