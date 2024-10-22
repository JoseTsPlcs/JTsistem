

class ConsPanels extends ODD {

    constructor(i){

        super(i);
    }

    #SetVariables({panels=[]}){

        this.#panels = panels;
    }

    #panels = [
        {
            name:"",
            build:null,

        }
    ];
    #parents = [
        {
            name:"",
            doom:null,
        }
    ];

    #Build({parent,panels=[]}){

        if(parent==null) parent = document.body;

        this.#panels.forEach(panel => {
            
            switch (panel.tipe) {
                case "grid":
                


                break;
            }    

        });
        
    }
}