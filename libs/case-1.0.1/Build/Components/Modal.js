
class Modal extends ODD {

    constructor(i){

        const eventsNew = [
            {
                name:'builded',
                actions:[
                    {
                        name:'set active when builded',
                        action:({k})=>{

                            k.SetActive({active:i.active});
                        }
                    }
                ],
            }
        ];
        if(i.events==null) i.events = [...eventsNew];
        else i.events = [...i.events,...eventsNew];


        super(i);
        this.#Build({...i});
    }

    #modal = null;
    #content = null;

    //sizes xl, lg && sm
    #Build({parent,size,index=-10}){

        if(parent==null) parent = document.body;

        /*
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modal title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Modal body text goes here.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary">Save changes</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        */

        this.#modal = document.createElement("div");
        this.#modal.setAttribute("class","modal");
        this.#modal.setAttribute("tabindex",index);
        this.#modal.setAttribute("role","dialog");
        //this.#modal.Modal({focus:false});

        var id = parent.id + "_modal_" + this._name;
        this._id = id;
        this.#modal.setAttribute("id", id);
        parent.appendChild(this.#modal);

        var modal_dialog = document.createElement("div");
        modal_dialog.setAttribute("class","modal-dialog" + (size?" modal-"+size:""));
        modal_dialog.setAttribute("role","document");
        this.#modal.appendChild(modal_dialog);

        this.#content = document.createElement("div");
        this.#content.setAttribute("class","modal-content");
        this.#content.setAttribute("id", id+'_content');
        modal_dialog.appendChild(this.#content);

        this.CallEvent({name:'builded'});

        

        let k = this;
        $('#'+this._id).on('hidden.bs.modal', function (e) {
            
            //console.log("hiden ", id);
            k.CallEvent({name:"hiden"});
        });
    }

    GetContent(){

        return this.#content;
    }

    SetActive({active=false}){

        this.CallEvent({name:'setActive',params:{active:active}});

        if(active==true){

            var md = new bootstrap.Modal(this.#modal, {
                focus: false // Desactiva el auto-focus del modal
            });
            md.show();
    
            //$('#'+this.#modal.id).modal('show');
            this.CallEvent({name:'show'});
        }
        else{

            $('#'+this.#modal.id).modal('hide');
            this.CallEvent({name:'hide'});
        }

        
        
    }

}