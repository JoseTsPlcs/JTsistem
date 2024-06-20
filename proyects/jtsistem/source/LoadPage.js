

function UserLog_ChangePagesByCompany(userData){

    switch (userData.company.tipe) {
        case "3":
            
            money_use = money_dolar_simbol;
            Paginas_GetItem({seccName:"shop"}).title="trabajos";
            Paginas_GetItem({seccName:"shop"}).icon='<i class="bi bi-buildings"></i>';
            Paginas_GetItem({pageName:"orders"}).show=false;
            Paginas_GetItem({pageName:"sale new"}).title="nuevo trabajo";
            Paginas_GetItem({pageName:"sales control"}).title="control de trabajo";
            //Paginas_GetItem({pageName:"sales control"}).fechaMin= Date_FirstOfMoth();
            //Paginas_GetItem({pageName:"sales control"}).fechaMax= Date_LastOfMoth();
            Paginas_GetItem({pageName:"sales in process"}).title="trabajos en proceso o confirmados";
            Paginas_GetItem({pageName:"sales to pay"}).title="trabajos por cobrar";
            Paginas_GetItem({pageName:"cash"}).show=false;
            Paginas_GetItem({pageName:"vehicles"}).show=false;

            Paginas_GetItem({seccName:"buys"}).show=false;

            Paginas_GetItem({pageName:"contacts-provieeders"}).show=false;
            Paginas_GetItem({seccName:"stock"}).show=false;

        break;

        case "1":
            
            Paginas_GetItem({pageName:"orders"}).show=false;
            Paginas_GetItem({pageName:"vehicles"}).show=false;
            Paginas_GetItem({pageName:"inmuebles"}).show=false;

        break;

        case "4":
            
            Paginas_GetItem({pageName:"orders"}).show=false;
            Paginas_GetItem({pageName:"vehicles"}).show=false;
            Paginas_GetItem({pageName:"inmuebles"}).show=false;

        break;

        case "2":

            //console.log("asdaksdmasd");
            Paginas_GetItem({pageName:"inmuebles"}).show=false;
            Paginas_GetItem({seccName:"shop"}).icon='<i class="bi bi-wrench-adjustable"></i>';
            Paginas_GetItem({seccName:"shop"}).title="Taller";

            Paginas_GetItem({pageName:"recipe"}).show=false;
            Paginas_GetItem({pageName:"produccion"}).show=false;

        break;
    }

}


function ListOfForm_UserLog(userData) {
    
    //console.log("listofform userlog");
    company_id = userData.company.id;

    cnds_products[0].value = userData.company.id;
    ins_general[0].value = userData.company.id;

    ld_unids.conditions = [{
        table:"unids",
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    }];

    ld_products_tags.conditions = [{
        table:"products_tags",
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    }];

    ld_supplies.conditions.push({
        before:" AND ",
        table:"products",
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    });

    ld_pay_tag.conditions.push({
        before:" AND ",
        table:"pay_tag",
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    });

    ld_accounts.conditions.push({
        before:" AND ",
        table:"accounts",
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    });

    ld_workers.conditions[0].value=company_id;

    
}

functionOnlogPage.push(UserLog_ChangePagesByCompany);
functionOnlogPage.push(ListOfForm_UserLog);
