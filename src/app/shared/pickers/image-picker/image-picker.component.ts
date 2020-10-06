import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { LanguagesService, Labels } from 'src/app/languages.service';
import { Subscription } from 'rxjs';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core'
import { Platform } from '@ionic/angular';
import {AngularFireStorage} from '@angular/fire/storage'

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
arabicLabels: Labels[];
labelsSub: Subscription;
selectedImage: string;
@Output() imagePick = new EventEmitter<string | File>();
@Input() showPreview = false;
@ViewChild('filePicker',{ static: false}) filePickerRef: ElementRef<HTMLInputElement>;

usePicker = false;
filePath:String


constructor(
  private langService: LanguagesService,
  private platform: Platform,
  private afStorage: AngularFireStorage
  ) { }
  
  ngOnInit() {
    console.log('Mobile:', this.platform.is('mobile'))
    console.log('Hybrid:', this.platform.is('hybrid'))
    console.log('ios:', this.platform.is('ios'))
    console.log('Android:', this.platform.is('android'))
    console.log('Desktop:', this.platform.is('desktop'))
    
    if(this.platform.is('mobile') && !this.platform.is('hybrid') || this.platform.is('desktop')) {
      this.usePicker = true;
    }
    // this.labelsSub = this.langService.arabicLabel.subscribe(
      //   (labels) => {
        //     this.arabicLabels = labels}
        
        // );
        
      }
      
      onPickImage() {
        if ( !Capacitor.isPluginAvailable('Camera')) {
          this.filePickerRef.nativeElement.click();
          return;
        }
        Plugins.Camera.getPhoto({
          quality: 50,
          source: CameraSource.Prompt,
          correctOrientation: true,
          height: 320,
          width: 200, 
          resultType: CameraResultType.DataUrl
        }).then(image => {
          this.selectedImage = image.dataUrl.toString();
          this.imagePick.emit(image.dataUrl)
        })
        .catch(err => {
          console.log(err);
          if(this.usePicker) {
            this.filePickerRef.nativeElement.click();
          }
          return false;
        }) 
      }
      
      onFileChosen(event: Event) {
        const pickedFile = ( event.target as HTMLInputElement).files[0];
        if( !pickedFile) {
          return;
        }
        const fr = new FileReader();
        fr.onload = () => {
          const dataUrl = fr.result.toString();
          this.selectedImage = dataUrl;
          this.imagePick.emit(pickedFile)
        };
        fr.readAsDataURL(pickedFile);
      }
      
      upload(event) {    
        this.filePath = event.target.files[0]
      }
      uploadImage(){
        console.log(this.filePath)
        this.afStorage.upload('/images/'+Math.random()+this.filePath, this.filePath);
      }
    }
    