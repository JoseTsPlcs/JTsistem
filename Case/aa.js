
function AddText(htm) {
    
    document.body.innerHTML += htm;
}

//--------boostrap ------

/*AddText('<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>');
AddText('<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>');
AddText('<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>');

AddText('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>');

//-----excel-----
//echo '<script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>';
AddText('<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>');
AddText('<script src="//cdn.rawgit.com/rainabba/jquery-table2excel/1.1.0/dist/jquery.table2excel.min.js"></script>');

//------select----
AddText('<script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js"></script>');

//------------------BOOSTRAP-----------------

//base data
AddText('<script src="Source/Usefull.js"></script>');
AddText('<script src="Source/Forms.js"></script>');

AddText('<script src="Build/Params.js"></script>');
AddText('<script src="Build/Box.js"></script>');
AddText('<script src="Build/Grid.js"></script>');
AddText('<script src="Build/Label.js"></script>');
AddText('<script src="Build/Modulo.js"></script>');
AddText('<script src="Build/Modulo_Filter.js"></script>');
AddText('<script src="Build/Form_Body.js"></script>');
AddText('<script src="Build/Table_Grid.js"></script>');

AddText('<script src="BaseData/Mysql.js"></script>');
AddText('<script src="BaseData/Load.js"></script>');
AddText('<script src="BaseData/Load_Table.js"></script>');

AddText('<script src="Build/Window.js"></script>');
AddText('<script src="Build/Form_Data.js"></script>');
AddText('<script src="Build/Form_Base.js"></script>');
AddText('<script src="Build/Form_Table.js"></script>');
AddText('<script src="Build/Form_Modulos.js"></script>');
AddText('<script src="Build/Master.js"></script>');

AddText('<script src="Land/UserLog.js"></script>');
AddText('<script src="Land/Pag_Base.js"></script>');*/


//conect javascrit of page
const path = window.location.pathname;
const prms = path.split('/');
const title = prms.length > 3 ? 'Index.php' : prms[2];

const dom = document.createElement('script');
dom.setAttribute('src', (carp? carp : '') + 'Pages/' + title.replace('php','js'));
document.body.appendChild(dom);
