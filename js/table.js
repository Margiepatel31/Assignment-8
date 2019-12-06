var tblGenerator = {

  // table defaults
  xBegin : 1 ,
  xEnd : 10 ,
  yBegin : 1 ,
  yEnd : 10 ,

  // a simple function to return the value to be inserted into the computed table cells
  multiply : function(a, b) {
    return a * b;
  }, /* note comma here to separate this property from the next one */

  // a simple function to test references to member functions via "this"
  square : function(n) {
    return this.multiply(n, n); /* note the use of this here */
  },

  // create an HTML table based on the given number of rows and each row with
  //    the given number of columns with given id
  // idTable - id of the table
  // rows - number of rows to create in the table
  // cols - number of columns to create in the table
  // idAppendTableTo - id to append the table to
  createTable : function(idTable, rows, cols, idAppendTableTo) {
    // console.log("create table with id=" + idTable + " rows=" + rows + " cols=" + cols);

    var table = $('<table></table>').attr('id', idTable);

    // create the table cells
    for ( var r = 0; r < rows + 1 ; r++) {
      row = $('<tr></tr>');
      for ( var c = 0; c < cols + 1 ; c++) {
        col = $('<td></td>');
        row.append(col);
      }
      table.append(row);
    }

    $(idAppendTableTo).append(table);

  } , // end createTable

  // populate a multiplication using jQuery given the id to append the table to
  // by John Spencer of NetScout Systems, Inc., based on code by Jesse Heines, UMass Lowell
  // parameters:
  //    idAppendTableTo       - id to append the multiplication table to
  //    bAddCommas            - true = add commas to numbers > 999
  //    bHandleSwitchedValues - true = print column heads in descending order if xBegin > xEnd,
  //    likewise print row heads descending order if yBegin > yEnd
  populateMultiplicationTable_jQuery : function( idAppendTableTo, bAddCommas, bHandleSwitchedValues ) {
    // create an HTML table with the requested number of rows and columns id="tbl1"
    //    and append the table to the id stored in variable idAppendTableTo
    var nCols = Math.abs( tblGenerator.xEnd - tblGenerator.xBegin ) + 1 ;
    var nRows = Math.abs( tblGenerator.yEnd - tblGenerator.yBegin ) + 1 ;
    // modification added for Version 8 to allow xEnd to be < xBegin and/or
    //    yEnd to be < yBegin
    if ( bHandleSwitchedValues ) {
      if ( nRows < 0 ) {
        nRows = Math.abs( nRows ) + 2 ;
      }
      if ( nCols < 0 ) {
        nCols = Math.abs( nCols ) + 2 ;
      }
    }
    this.createTable( "tbl1", nRows, nCols, idAppendTableTo ) ;
    // original version
    //   this.createTable("tbl1", ( tblGenerator.yEnd - tblGenerator.yBegin + 1 ),
    //       ( tblGenerator.xEnd - tblGenerator.xBegin + 1 ), idAppendTableTo ) ;

    // get the rows in the table
    var rows = $('#tbl1 tr');
    var nRows = rows.length;
    // console.log("number of table rows (nRows) = " + nRows);

    // populate first row column heads
    $( '#tbl1 tr:first-child td').each( function( index, elem ) {
      // note that inside this .each loop, $(this) and $(elem) are the same object
      if ( index !== 0 ) {
        if ( bHandleSwitchedValues && tblGenerator.xBegin > tblGenerator.xEnd ) {
          $(elem).html( tblGenerator.xBegin - index + 1 ) ;
        } else {
          $(elem).html( tblGenerator.xBegin + index - 1 ) ;
        }
        $(elem).css( {
          "color" : "white" ,
          "background-color" : "black"
        } ) ;
      }
    } ) ;

    // traverse each row
    rows.each( function( rowIndex, rowValue ) {
      // console.log(rowIndex + ': ' + rowValue);
      // get the columns in each row
      var cols = $(this).find('td');
      var nCols = cols.length ;
      // console.log("number of columns in row " + rowIndex + " = " + nCols);

      // traverse each column
      cols.each( function( colIndex, colValue ) {
        if ( rowIndex !== 0 && colIndex === 0 ) {
          // note that inside this .each loop, $(this) and $(colValue) are the same object
          if ( bHandleSwitchedValues && tblGenerator.yBegin > tblGenerator.yEnd ) {
            $(this).html( tblGenerator.yBegin - rowIndex + 1 ) ;
          } else {
            $(this).html( tblGenerator.yBegin + rowIndex - 1 ) ;
          }
          $(colValue).css( {
            "color" : "white" ,
            "background-color" : "black"
          } ) ;
        } else if ( rowIndex !== 0 ) {
          // calculate the value for the cell
          // console.log( $(rowValue).find( "td:first-child" ).html() ,
          //     $(rows[0]).find( 'td:nth-child(' + (colIndex+1) + ')' ).html() ) ;
          var nValue = tblGenerator.multiply(
              $(rowValue).find( "td:first-child" ).html(),
              $(rows[0]).find( 'td:nth-child(' + (colIndex+1) + ')' ).html() ) ;
          // set the value in the cell
          if ( bAddCommas ) {
            $(this).html( tblGenerator.addCommas( nValue ) ) ;
          } else {
            $(this).html( nValue ) ;
          }
        }
      }); // end cols.each

    });  // end rows.each

  } ,   // end populateMultiplicationTable_jQuery

  /**
   *  Formats a numeric string by adding commas for cosmetic purposes.
   *  @author Keith Jenci
   *  @see http://www.mredkj.com/javascript/nfbasic.html
   *  @param {String} nStr A number with or without decimals.
   *  @returns a nicely formatted number.
   *  @type String
   */

  /**
   *  Additional documentation and formatting and variable name changes
   *  made by Jesse Heines on September 10, 2012 at 8:31 AM.
   */
  "addCommas" : function( strNumber ) {
    strNumber += "" ;                       // ensures that argument strNumber is indeed a string
    var arrNumber = strNumber.split(".") ;  // splits strNumber on the decimal point
    var numericPart = arrNumber[0] ;        // the first array element is the numeric part of the number
    var decimalPart = arrNumber.length > 1 ? "." + arrNumber[1] : "" ;
        // the second array element is the decimal part of the number
        // this is the part of the number after the ".", or an empty string ("") if there is no decimal point

    var rgx = /(\d+)(\d{3})/ ;
        // this regular expression matches 1 or more decimal digits followd by a group of 3 decimal digits
        // \d matches any decimal digit
        // \d+ matches 1 or more decimal digits
        // \d{3} matches 3 decimal digits, which is the same as \d\d\d
        // the parentheses group the matches so that they can be referred to as $1 and $2 below
        // this regular expression will therefore match whenever there are at least 4 decimal digits in a row

    // repeat until the regular expression no longer matches
    while ( rgx.test( numericPart ) ) {
      numericPart = numericPart.replace( rgx, "$1" + "," + "$2" ) ;
        // $2 is the group of 3 decimal digits at the right of the matched expression
        // $1 is the group of 1 or more decimal digits to the left of the group of 3
        // this statement therefore concatenates the left group with a comma followed by the group of 3
    }

    // return the formatted numeric part concatenated to the original fractional part (which may be blank)
    return numericPart + decimalPart ;
  }
} ;
