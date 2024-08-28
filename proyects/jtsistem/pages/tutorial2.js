
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      //build modulos
      var fields = [];
      for (let q = 0; q < TutorialData.length; q++) {

        const question = TutorialData[q];

        fields.push({
          col:2,
          name:"questionIteaction"+q,
          tipe:0,
          box:{
            tipe:5,
            class:"btn btn-secondary btn-sm",
            value:'<i class="bi bi-question-circle"></i>',
          },
        });
        fields.push({
          col:10,
          name:"questionName"+q,
          tipe:0,
          box:{
            tipe:0,
            class:"text-left w-100 px-1",
            value:question.show
          },
        });          

      };

      new Form({
        title:"tutorial",
        parent:pageData.body,
        blocked:false,show:true,
        fields,
        events:[{name:"fieldUpdate",actions:[{action:(value)=>{PlayTutorial({questIndex:value.y})}}]}],
      });

      function PlayTutorial({questIndex=-1}) {
        
        var tutorial = TutorialData[questIndex];
        var pageInfo = PageDataFind({pageName:tutorial.pages[1].value});
        
        console.log("PLAY TUTORIAL !!!", tutorial,pageInfo);

        PageSend({
          url:pageInfo.href, 
          send:{
            tutorialPlay:tutorial.value,
          }
        });

        /*var tut = new Tutorial({
          elementsInfo:[
            ...tutorial.pages[0].elementsInfo,
          ],
        });
        tut.startTutorial();*/
      }
      
    }
  });
  

});
