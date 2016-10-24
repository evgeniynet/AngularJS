import {Component, ElementRef, Input, OnInit, ViewChild, Renderer, Output, EventEmitter} from "@angular/core";
import {IONIC_DIRECTIVES} from 'ionic-angular';
/**
 * Upload button component.
 *
 * As native input elements with type file are diffcult to style, it is common practice to hide them
 * and trigger the needed events manually as it done here. A button is is used for user interaction,
 * next to the hidden input.
 *
 *  <code>
 *    @Component({
 *      directives: [UploadButton],
 *    })
 *    class UploadComponent {
 *    	private addCallback: Function = (files: FileList) => {...};
 *    	private icon: String = "add-circle";
 *    }
 *
 *  	<upload-button
 *  		(filesUploaded)="uploadFile($event)  <!-- the callback function executes after adding files -->
 *  		[btnStyle]="icon"               <!-- the ionic-icon name to use for button -->
 *  		[logCallback]="console.debug">  <!-- (optional) if needed a logger can be set -->
 *  		[allowMultiple]="false">        <!-- (optional) disable multiple file upload -->
 *  	</upload-button>
 *  </code>
 */
 @Component({
   directives: [IONIC_DIRECTIVES],
   selector: "upload-button",
   templateUrl: 'build/components/upload-button/upload-button.html',
 })
 export class UploadButtonComponent {

  /**
   * Native upload button (hidden)
   */
   @ViewChild("input")
   private nativeInputBtn: ElementRef;

  /**
   * The callback executed when files are selected, set by parent
   */
   @Output() public filesUploaded: EventEmitter<any> = new EventEmitter(false);

 /*** The destination of file 
      { ticket: "",
        account: "",
        asset: "",
        post_id: 0 
      }
      */
      @Input() private fileDest: String;

  /**
   * The callback executed when button pressed, set by parent
   */
   @Input() private btnStyle: String;

  /**
   * (Optional) Can be used to disable adding multiple files
   */
   @Input() private allowMultiple: boolean = true;

  /**
   * String used for control multiple uploads
   */
   private multi: string = "multiple";
   error: string = "";
   files: any = [];

  /**
   * (Optional) if needed a logger can be used
   */
   @Input()
   private logCallback: Function;

  /**
   * Constructor
   *
   * @param  {Renderer} renderer for invoking native methods
   * @param  {Log}      logger instance
   */
   constructor(private renderer: Renderer) {
     if (this.allowMultiple === false) {
       this.multi = "";
     }
   }

   ngOnInit() {
    //console.log("######################i nininiini");
  }

  public upload (url: string, files: File[]): Promise<any> {
    return new Promise((resolve, reject) => {

      let xhr:XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
                    resolve(xhr.response); //JSON.parse(xhr.response)
                  } else {
                    reject(xhr.response);
                  }
                }
              };

              xhr.open('POST', url+"files/", true);
              xhr.setRequestHeader("Authorization", "Basic " + btoa("u0diuk-b95s6o:2mzer2k5k0srgncebsizvfmip0isp2ii"));
            //xhr.withCredentials = true;
            //console.log(this.fileDest);
            let formData: FormData = new FormData();
            for ( var key in this.fileDest ) {
              formData.append(key, this.fileDest[key]);
            }
            for (let i = 0; i < files.length; i++) {
              formData.append("uploads[]", files[i], files[i].name);
            }

            xhr.send(formData);
          });
  }

  onUpload() {
    console.log("upload start");
    if (!this.files.length) {
      return;
    }
    this.upload("http://api.beta.sherpadesk.com/", this.files).then((data) => {
      this.filesUploaded.next("ok" + data);
      this.reset();
    }).catch((ex) => {
      this.filesUploaded.next("error");
      console.error('Error fetching users', ex);
    });
  }

  reset()
  {
    this.files = [];
    this.nativeInputBtn.nativeElement.value = '';
  }

  /**
   * Callback executed when the visible button is pressed
   *
   * @param {Event} event should be a mouse click event
   */
   public callback(event: Event): void {
     this.log("UploadButton: Callback executed triggerig click event", this.nativeInputBtn.nativeElement);

    // trigger click event of hidden input
    let clickEvent: MouseEvent = new MouseEvent("click", {bubbles: true});
    this.renderer.invokeElementMethod(
      this.nativeInputBtn.nativeElement, "dispatchEvent", [clickEvent]);
  }

  /**
   * Callback which is executed after files from native popup are selected.
   *
   * @param {Event} event change event containing selected files
   **/ 
   filesAdded(event: Event) {
     let files: FileList = this.nativeInputBtn.nativeElement.files;
     this.log("UploadButton: Added files", files);
     let checkfiles: any = [];
     this.error = "";
     for (let i = 0; i < files.length; i++) {
       if (this.isFile(files[i]))
              checkfiles.push(files[i]);
       else 
       {
         if (files[i].size === 0)
             this.error += `File ${files[i].name} has zero size`;
           else
             this.error += `File #${i} has empty name`;
            }
       }
     this.files = checkfiles;
   }

  /**
   * (Optional) If needed for debugging
   *
   * @param {any[]} ...args console.log like paramter <code>log("Error", obj, 1)</code>
   */
   private log(...args: any[]): void {
     if (this.logCallback) {
       console.log(args);
       //this.logCallback(args);
     }
   }

 humanizeBytes(bytes: number) {
  if (bytes === 0) {
    return '0 Byte';
  }
  let k = 1024;
  const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let i: number = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

isImage(url) {
            if(!url) return false;
            return url.trim().match(/(jpeg|jpg|gif|png|ico)$/i) !== null;
        }

isFile(file: any): boolean {
    return file !== null && (file instanceof Blob && (file.name.trim() && file.size));
  }

 }
