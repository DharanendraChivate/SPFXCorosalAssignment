import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import styles from './SliderSpfxWebPart.module.scss';
import * as strings from 'SliderSpfxWebPartStrings';
import * as $ from 'jquery';
import * as bs from 'bootstrap';
require('bootstrap');
export interface ISliderSpfxWebPartProps {
  description: string;
}

export default class SliderSpfxWebPart extends BaseClientSideWebPart<ISliderSpfxWebPartProps> {

  public render(): void {
    let cssURL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    SPComponentLoader.loadCss(cssURL);
    this.domElement.innerHTML = `
      <div class="${ styles.sliderSpfx }">
        <div class="${ styles.container }">
          <div class="${ styles.row }" style="background-color: #a6a6a6;">


          <div id="myCarousel" class="carousel slide" data-ride="carousel">
            <!-- Indicators -->
            <ol class="carousel-indicators" id="orderlistid">           
            </ol>        
              <!-- Wrapper for slides -->
              <div class="carousel-inner" id="ScrollCorosal">           
              </div>            
              <!-- Left and right controls -->
              <a class="left carousel-control" href="#myCarousel" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="right carousel-control" href="#myCarousel" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
                <span class="sr-only">Next</span>
              </a>
            </div>
          </div>
        </div>
      </div>


      <!------------------------Modal Start-------------------------->
      <div class="modal fade" id="myModal" role="dialog">
        <div class="modal-dialog">        
          <!-- Modal content-->
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Display Data</h4>
            </div>
            <div class="modal-body" id="modelBody">
            
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>          
        </div>
     </div>
     <!------------------------Modal Start-------------------------->
      
      `;
      var Absourl = this.context.pageContext.web.absoluteUrl;
      $(document).ready(function(){
       // alert("ready called");
       /*****************************Load Data*****************************/
        var call = jQuery.ajax({
          url: Absourl + "/_api/Web/Lists/getByTitle('Managers Speaks')/Items?$select=ImageUrl,Subject,Description,ID&$orderby= Created desc",
          type: "GET",
          dataType: "json",
          headers: {
              Accept: "application/json; odata=verbose",
              "Content-Type": "application/json;odata=verbose"
          }
      });
        call.done(function (data, textStatus, jqXHR) {          
            $('#orderlistid li').remove();
            $('#ScrollCorosal div').remove();
            var orderedList = $('#orderlistid');
            var corosalContainer = $('#ScrollCorosal');
            $.each(data.d.results, function (idx, elem) {
              if(idx == "0")
              {
                orderedList.append("<li data-target='#myCarousel' data-slide-to='" + elem.ID + "' class='active' ></li>");
                corosalContainer.append("<div class='item active'><div class='col-md-8' style='padding-left: 15%;'><img src='"+elem.ImageUrl+"' style='width: 50%;'></div><div class='col-md-4'><p style='font-weight: bold;'>Subject : </p><p>"+elem.Subject+"</p><button type='button' class='btn btn-info btn-sm' data-toggle='modal' id='"+ elem.ID  +"'>Dark</button></div></div>")
              }
              else{
                orderedList.append("<li data-target='#myCarousel' data-slide-to='" + elem.ID + "'></li>");
                corosalContainer.append("<div class='item'><div class='col-md-8' style='padding-left: 15%;'><img src='"+elem.ImageUrl+"' style='width: 50%;'></div><div class='col-md-4'><p style='font-weight: bold;'>Subject : </p><p>"+elem.Subject+"</p><button type='button' class='btn btn-info btn-sm callmodalJquery' data-toggle='modal' id='"+ elem.ID  +"'>Dark</button></div></div>")
              }
              
            });
        });
        call.fail(function (jqXHR, textStatus, errorThrown) {
       //   alert("fail dattaaa");
            var response = JSON.parse(jqXHR.responseText);
            var message = response ? response.error.message.value : textStatus;
            alert("Call hutch failed. Error: " + message);
        });


        /****************Popup Method OnClick Button*********************/
        $(document).on("click", ".btn-info" , function() {
           var a =  $(this).attr("id");
           $('#modelBody div').remove();
          $('#myModal').modal('show');   
          var popupData = $('#modelBody');
          /***************************Ajax single item****************************/
          var call = jQuery.ajax({
            url: Absourl + "/_api/Web/Lists/getByTitle('Managers Speaks')/Items?$select=ImageUrl,Subject,Description,ID&$filter=(ID eq '"+a+"')&$orderby= Created desc",
            type: "GET",
            dataType: "json",
            headers: {
                Accept: "application/json; odata=verbose",
                "Content-Type": "application/json;odata=verbose"
            }
        });
          call.done(function (data, textStatus, jqXHR) {     
           // alert("filtered datta popup gagag");
             // $('#modelBody div').remove();
              
              $.each(data.d.results, function (idx, elem) {
               
                  popupData.append("<div class='col-md-12' style='margin-top: 5%;'><div class='col-md-8' style=''><img src='"+elem.ImageUrl+"' style='width: 100%;'></div><div class='col-md-4' style='padding-top: 5%;'><p><h4 style='font-weight: bold;'>Subject : </h4>"+elem.Subject+"</p></div></div>");
                  popupData.append("<div class='col-md-12' style='margin-top: 5%;'><h5 style='font-weight: bold;'>Description : </h5>"+elem.Description+"</div>");
                
              });
          });
          call.fail(function (jqXHR, textStatus, errorThrown) {
           // alert("fail dattaaa");
              popupData.append("<div class='col-md-12'><h3 style='font-weight: bold;'>Cannot Load Data<h3></div>")
              var response = JSON.parse(jqXHR.responseText);
              var message = response ? response.error.message.value : textStatus;
              alert("Call hutch failed. Error: " + message);
          });
/***************************End Ajax single item****************************/

       });       
      });   
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
