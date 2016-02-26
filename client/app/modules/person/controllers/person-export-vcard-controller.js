import {saveAs} from "../../../scripts/FileSaver.min";

export function PersonExportVCardController(Person) {"ngInject";
  this.getAllVCard = () => {
    Person.exportVCard().$promise.then(
      (data) => {
        let files = [];
        let file = 0;
        data.vcard.forEach((vcard) => {
          if(files.length <= file) {
            files.push("");
          }
          files[file] += vcard;
          if(files[file].length * 2 > 5*1024*1024) {
            file += 1;
          }
        });
        
        for(let i = 0; i < files.length; i++) {
          let blob = new Blob([files[i]], { type: 'text/vcard' });
          saveAs(blob, "export"+i+".vcard");
        }
      }
    );
  };
}
