

const file_of_pages_script = 'Scripts';

//get title of url
const path = window.location.pathname;
const prms = path.split('/');
const title = prms[prms.length-1].replace('.php','');

//conect javascrit of page 
var dom = document.createElement('script');
const src =  file_of_pages_script + '/' + title + '.js';
dom.setAttribute('src',src);
document.body.appendChild(dom);

//set title to page
document.title = title;
