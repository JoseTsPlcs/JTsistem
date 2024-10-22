

function UserLog_ChangePagesByCompany(userData){

    

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
    ld_rucs.conditions[0].value=company_id;
    
}

functionOnlogPage.push(UserLog_ChangePagesByCompany);
functionOnlogPage.push(ListOfForm_UserLog);
