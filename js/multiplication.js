/*
File:
91.461 GUI Programming I  Assignment# 7:  Using the jQuery Validation Plugin with Dynamic Table
Margie Patel, Umass Lowell Computer Science, Margie_Patel@student.uml.edu
Copyright (c) 2019 by Margie_Patel. All rights reserved.
updated by MP on November 27, 2019 at 8:00 PM
Description:  this web page use javascript to create dynamic multiplication table from the user's input
*/


"use strict";
var tblInitializer = {

     // helper function for parameter initialization
     // note that to transfer the local value to the Utils member variable, we must use
     //    associative array syntax with square brackets because the name of the variable
     //    to be initialized is expressed as a string
     // updated by JMH on November 3, 2012 at 1:05 PM
     "initializeHelper" : function( strVarToInitialize ) {
       var str = getField( strVarToInitialize ) ;
       if ( str !== null ) {
         var n = parseInt( str, 10 ) ;
         if ( ! isNaN( n ) ) {
           tblGenerator[strVarToInitialize] = n ;
         }
       }

       // added in Version 2
       $( '#' + strVarToInitialize ).val( tblGenerator[ strVarToInitialize ] ) ;

       // added in Version 9 to initialize the sliders to the passed values
       // updated by JMH on November 26, 2012 at 9:05 PM
       var strSliderID = "#slider" + strVarToInitialize[0].toUpperCase()+strVarToInitialize.substr(1) ;
       $( strSliderID ).slider( "value", parseInt( str ) ) ;

       // bind changes in text fields to sliders
       $( '#' + strVarToInitialize ).blur( function() {
         // console.log( '#' + strVarToInitialize + " lost focus, slider is " + strSliderID ) ;
         $( strSliderID ).slider( "value", parseInt( $( '#' + strVarToInitialize ).val() ) ) ;
       } ) ;

       // prevent text field from getting focus by trapping focus to the field
       //    and instead switching focus to the A (anchor) tag in the slider DIV
       // this technique was developed by examining the slider structure in the Firebug HTML tab
       // also note that the text fields cannot be disabled, because if they are their values
       //    are not passed when the form is submitted
       // $( '#' + strVarToInitialize ).focus( function() {
       //   $( strSliderID + " a" ).focus() ;
       // } ) ;
     } ,

     // get passed parameters
     "initialize" : function() {
       tblInitializer.initializeHelper( "xBegin" ) ;
       tblInitializer.initializeHelper( "xEnd" ) ;
       tblInitializer.initializeHelper( "yBegin" ) ;
       tblInitializer.initializeHelper( "yEnd" ) ;
       tblInitializer.initializeHelper( "#btn" ) ;
     }
   } ; //tblInitializer

   var tblValidator = {   // added in Version 4

     // surround an erroneous error field with a red border
     highlightError : function( strVarToTest ) {
       $( '#' + strVarToTest ).css( { "border" : "2px solid red" } )  ;
       $( '#' + strVarToTest ).focus() ;
     } ,

     // remove the red border around an erroneous error field
     unhighlightError : function( strVarToTest ) {
       $( '#' + strVarToTest ).css( { "border" : "" } )  ;
     } ,

     // check that a parameter exist, is not an empty string, and is not NaN
     // this function is not used in Version 8 -- it is replaced by functionality
     //    in the Validation plugin
     validateFormHelper : function( strVarToTest, strParamDesc ) {
       var str = $( '#' + strVarToTest ).val() ;
       if ( str === null ) {
         tblValidator.highlightError( strVarToTest ) ;
         return strParamDesc + " does not exist." ;
       } else if ( str === "" ) {
         tblValidator.highlightError( strVarToTest ) ;
         return strParamDesc + " was not supplied." ;
       } else if ( isNaN( parseInt( str, 10 ) ) ) {
         tblValidator.highlightError( strVarToTest ) ;
         return strParamDesc + " is not a number." ;
       }
       $( '#' + strVarToTest ).css( { "border" : "" } )  ;
       return "OK" ;
     } ,

     // called when the form is submitted to check the validity of each parameter
     // this function is not used in Version 8 -- it is replaced by functionality
     //    in the Validation plugin
     validateForm : function() {
       // http://stackoverflow.com/questions/4079274/how-to-get-an-objects-properties-in-javascript-jquery
       // var v = $('#frm').validate() ;
       // for ( var key in v ) {
       //   console.log( "key = " + key + ", value = " + v[key] ) ;
       // }

       var str ;   // helper function return value
       if ( ( str = tblValidator.validateFormHelper( "xBegin", "Minimum Column Value" ) ) !== "OK" ||
            ( str = tblValidator.validateFormHelper( "xEnd"  , "Maximum Column Value" ) ) !== "OK" ||
            ( str = tblValidator.validateFormHelper( "yBegin", "Minimum Row Value" ) ) !== "OK" ||
            ( str = tblValidator.validateFormHelper( "yEnd"  , "Maximum Row Value" ) ) !== "OK" ) {
         $('#msg').html( str ) ;
         return false ;
       }
       return true ;
     }

   } ; // tblValidator

$().ready(function(){

  var sliderOpts = {
       min : -100 ,
       max : 100 ,
       min1:-100,
       max1:100,
       // value : 0 ,
       slide : function( e, ui ) {

         //// the following code displays all the properties of object e
         // var msg = "" ;
         // for ( var key in e ) {
         //   msg += "key = " + key + ", value = " + e[key] + "<br>" ;
         // }
         // $('#msg').html( msg ) ;

         // set the input field value to the new slider value
         var strInputID = "#" + e.target.id.substr( 6, 1 ).toLowerCase() + e.target.id.substr( 7 ) ;


         $( strInputID ).val( ui.value ) ;

         // remove and regenerate the table when the slider is changed
         $('#tbl1').remove() ;
         tblGenerator.xBegin = parseInt( $('#xBegin').val() ) ;
         tblGenerator.xEnd =   parseInt( $('#xEnd').val() ) ;
         tblGenerator.yBegin = parseInt( $('#yBegin').val() ) ;
         tblGenerator.yEnd =   parseInt( $('#yEnd').val() ) ;
         tblGenerator.populateMultiplicationTable_jQuery( "#placeholder", true, true ) ;
       }
     } ;
     $('#sliderXBegin').slider( sliderOpts ) ;
     $('#sliderXEnd').slider( sliderOpts ) ;
     $('#sliderYBegin').slider( sliderOpts ) ;
     $('#sliderYEnd').slider( sliderOpts ) ;

     // initialize the table from the passed values
     tblInitializer.initialize() ;
     $( '#sliderXBegin' ).slider( "value", parseInt( $( '#xBegin' ).val() ) ) ;
         $( '#sliderXEnd' ).slider( "value", parseInt( $( '#xEnd' ).val() ) ) ;
         $( '#sliderYBegin' ).slider( "value", parseInt( $( '#yBegin' ).val() ) ) ;
         $( '#sliderYEnd' ).slider( "value", parseInt( $( '#yEnd' ).val() ) ) ;

         $('#frm').submit( function() {  // revised in Version 6

               // the following statement was added in Version 8 to eliminate the switching
               // instead, this version changes the table generation algorithm so that it
               //    prints from high to low if the numbers are reversed
               if ( true ) return true ;

               // the statements below were added in Version 6 to switch any parameters for
               //    which the minimum was greater than the maximum
               if ( parseInt( $('#xBegin').val(), 10 ) > parseInt( $('#xEnd').val(), 10 ) ) {
                 // console.log( "switching x" ) ;
                 var temp = $('#xBegin').val() ;
                 $('#xBegin').val( $('#xEnd').val() ) ;
                 $('#xEnd').val( temp ) ;
               }
               if ( parseInt( $('#yBegin').val(), 10 ) > parseInt( $('#yEnd').val(), 10 ) ) {
                 // console.log( "switching y" ) ;
                 var temp = $('#yBegin').val() ;
                 $('#yBegin').val( $('#yEnd').val() ) ;
                 $('#yEnd').val( temp ) ;
               }
               // console.log( $('#xBegin').val() + " " + $('#xEnd').val() + " " +
               //     $('#yBegin').val() + " " + $('#yEnd').val() ) ;

               return true ;
             } ) ;




  $.validator.addMethod("greaterThan", function(value, max, min){
    return parseInt(value) >= parseInt($(min).val());},
    "Ending number must be greater or equal to Starting number"
  ); // ends addMethod


  $('#frm').validate({
    // validation rules
    rules : {

      sMultiplier : {
        required: true,
        min : -100,
        number: true
      } ,

      eMultiplier : {
        required: true,
        max : 100,
        number: true,
        greaterThan : '#xBegin'
      } ,

      sMultiplicand : {
        required: true,
        number: true,
        min : -100
      } ,

      eMultiplicand : {
        required: true,
        number: true,
        max : 100,
        greaterThan : '#yBegin'
      }

    }, // ends rules

    // error messages
    messages: {

      sMultiplier : {
        required : function() {
          return " Starting multiplier is required." ;
        } ,
        min : function() {
          return " Please enter a number greater or equal to -50";
        },
        number : function() {
          return "Please enter valid number" ;
        }
      } ,//sMultiplier

      eMultiplier : {
        required : function() {
          return "Ending multiplier is required." ;
        } ,
        max: function() {
          return " Please enter a number less or equal to 50";
        },
        number : function() {
          return "Please enter valid number" ;
        },
        greaterThan : function() {
          return "Ending number must be greater or equal to Starting number" ;
        }
      }, //eMultiplier

      sMultiplicand : {
        required : function() {
          return "Starting multiplicand is required." ;
        },
        min : function() {
          return "Please enter a number greater or equal to -100";
        },
        number : function() {
          return "Please enter valid number" ;
        }
      } ,//sMultiplicand

      eMultiplicand : {
        required : function() {
          return "Ending multiplicand is required." ;
        },
        max: function() {
          return "Please enter a number less or equal to 100";
        },
        number : function() {
          return "Please enter valid number" ;
        },
        greaterThan : function() {
          return "Ending number must be greater or equal to Starting number" ;
        }
      } //eMultiplicand

    },// messages

    success: function(label) {
      label.addClass("valid");
    },
  }); // ends validate
});

$(document).ready(function(){
$("#ca").click(function () {

      if ($("#frm").valid() == false) {
        if (document.getElementById("table").hasChildNodes()){
          document.getElementById("table").innerHTML = "";
        }
        return;
      }
      else {
        if (document.getElementById("table").hasChildNodes()){
          document.getElementById("table").innerHTML = "";
        }

        var sMultiplier = $('#xBegin').val();
        console.log(sMultiplier);
        var eMultiplier = $('#xEnd').val();
        var sMultiplicand = $('#yBegin').val();
        var eMultiplicand = $('#yEnd').val();

        var table =  document.createElement("TABLE");
        table.setAttribute("id", "myTable");
        document.getElementById("table").appendChild(table);

        var i;
        var j;
        var r;
        var s;

        for(i = sMultiplicand - 1,  r = 0;  i <= eMultiplicand;  i++, r++) {

          var row = table.insertRow(r);

          for(j = sMultiplier - 1,  s = 0; j <= eMultiplier; j++, s++) {

            var cell = row.insertCell(s);

            /* multiplier row*/
            if (r === 0 && s > 0) {
              cell.innerHTML = j;
            }

            /* multiplicand column */
            else if (s === 0 && r > 0) {
              cell.innerHTML = i;
            }

            /* multiplication of corresponding entries */
            else if (s > 0 && r > 0) {
              cell.innerHTML = i * j;
            }

          } // inner for loop ends

        }  // outer for loop ends

      } //else
      //your code here is wrong,change to '})',then ok!!
    }); // btn

//  }); // ready end



  $("#saveData").click(function () {

        console.log("das");
  }); // btn

}); // ready end
