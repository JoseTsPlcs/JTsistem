

const file_of_pages_script = 'Scripts';


//get title of url
const path = window.location.pathname;
const prms = path.split('/');
const title = prms.length > 2 ? 'Index.php' : prms[1];

//conect javascrit of page 
const dom = document.createElement('script');
dom.setAttribute('src', file_of_pages_script + '/' + title.replace('php','js'));
document.body.appendChild(dom);
