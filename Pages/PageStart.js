
const pageinfo = {
  title: 'title page',
  filename: 'title.php',
  id : 0,
  path: '',
}

function StartPage(title, filename, id, success) {

  pageinfo['title'] = title;
  pageinfo['filename'] = filename;
  pageinfo['id'] = id;

  document.title = title;
  console.log("------PAGE " + title + " STARTED ------");

  pageinfo['path'] = window.location.pathname;
  pageinfo['path'] = pageinfo['path'].replace(filename, '');
  //console.log(pageinfo['path']);

  

  if(success != null) success();
}
