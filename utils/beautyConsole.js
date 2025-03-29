export const BORDERS_SIMPLE ={
  tl:"+",
  tc:"+",
  tr:"+",
  cl:"+",
  cc:"+",
  cr:"+",
  bl:"+",
  bc:"+",
  br:"+",
  v:"|",
  h:"-",
}

export const BORDERS_FINE = {
  tl:"╔",
  tc:"╦",
  tr:"╗",
  cl:"╠",
  cc:"╬",
  cr:"╣",
  bl:"╚",
  bc:"╩",
  br:"╝",
  v:"║",
  h:"═",
}

export const BORDERS_SPACE = {
  tl:" ",
  tc:" ",
  tr:" ",
  cl:" ",
  cc:" ",
  cr:" ",
  bl:" ",
  bc:" ",
  br:" ",
  v:" ",
  h:" ",
}





/**
 * 
 * @param {string} color
 * @param {string} text 
 * @returns 
 */
export function c(color_, text = "") {
    const color = color_.toLowerCase();
    const colors = {
      reset: "\x1b[0m",
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
    };

    //ALIAS
    colors.r = colors.red
    colors.g = colors.green
    colors.y = colors.yellow
    colors.b = colors.blue
    colors.w = colors.white
  
    if (text === "") {
      return colors[color]
    }
  
    const prefix = colors[color] || colors.reset;
    const suffix = colors.reset;
  
    return `${prefix}${text}${suffix}`;
  }
  
  
/**
 * Generates a title string with optional text, length, and spacer.
 *
 * @param {string} [text=""] - The text to be included in the title.
 * @param {Object} [options] - An object containing optional settings.
 * @param {number} [options.length=70] - The total length of the title line.
 * @param {string} [options.spacer="-"] - The character used to create the title line.
 * @returns {string} The generated title string.
 */
export function title(text="",options) {
    const OPT = {
      length:70,
      spacer:"-",
      ...options
    }
  
    const spacerCount = Math.ceil(OPT.length / OPT.spacer.length);
    const line = OPT.spacer.repeat(spacerCount)
  
  
    const l = OPT.length
    const w = text.length
    const x = (Math.floor(l - w) / 2)
  
    text = text.split("").map((c, i) => (c == " " ? line[i] : c)).join("")
  
    return line.slice(0, x) + text + line.slice(x + w, l);
  }
  
  
  /**
   * 
   * @param {string[]} lines 
   * @param {number} leftPadding 
   * @param {string} color 
   * @returns string
   */
  export function createAsciiBox(lines, leftPadding = 0, color = "reset",borders={}) {

    const BORDERS = {
      ...BORDERS_FINE,
      ...borders
    }

  
    const maxLength = lines.reduce((acc, v) => Math.max(acc, v.length), 0)
  
    const leftSpaces = " ".repeat(leftPadding)
    const topBorder = leftSpaces + c(color) + BORDERS.tl + BORDERS.h.repeat(maxLength + -3) + BORDERS.tr + c("reset");
    const bottomBorder = leftSpaces + c(color) + BORDERS.bl + BORDERS.h.repeat(maxLength + -3) + BORDERS.br + c("reset");
  
    const content = lines.map((line) => {
      const padding = ' '.repeat(maxLength - line.length);
      const newLine = `${leftSpaces}${c(color, BORDERS.v)} ${line}${c("reset")}${padding} ${c(color, BORDERS.v)}`;
      return newLine
    });
  
    return [topBorder, ...content, bottomBorder].join('\n');
  }
  
  
  








  
  
  /**
   * 
    * @param {string[][]} mat - The 2D matrix containing the table data.
    * @param {Object} [options] - An object containing optional settings.
    * @param {boolean} [options.outerBox=false] - Include an outer box border.
    * @param {boolean} [options.separatorHeader=false] - Add a separator below the header.
    * @param {boolean} [options.separatorAll=false] - Add separators between all rows.
    * @param {boolean} [options.verticalSeparator=true] - Add separators between all columns.
    * @param {number} [options.paddingH=1] - Horizontal cell padding.
    * @param {number} [options.paddingV=0] - Vertical cell padding.
    * @param {string} [options.headerColor="cyan"] - Color for the header cells.
    * @param {string} [options.cellColor="reset"] - Color for the non-header cells.
    * @param {string} [options.borderColor="white"] - Color for the table borders.
    * @param {boolean} [options.autoConsoleLog=true] - Automatically log the table to the console.
    * @param {boolean} [options.allRowsEqualHeight=false] - Make all rows same heigth even if the current row dont have breaklines.
    * @returns {string} The generated ASCII table string.
 */
  export function createAsciiTable(mat,options,borders){
    const OPT={
      outerBox:false,
      separatorHeader:true,
      separatorAll:false,
      verticalSeparator:true,
      paddingH:0,
      paddingV:0,
      headerColor:undefined,
      cellColor:undefined,
      borderColor:undefined,
      autoConsoleLog:true,
      allRowsEqualHeight:false,
      maxFieldLength: undefined,
      ...options
    }
    let result = ""
    const BORDERS={
      ...BORDERS_FINE,
      ...borders
    }
  
    // Logic to handle maxFieldLength
    const applyMaxFieldLength = (str) => {
      if (OPT.maxFieldLength && str.length > OPT.maxFieldLength) {
        return str.slice(0, OPT.maxFieldLength - 3) + "...";
      }
      return str;
    }
    
    if (OPT.borderColor) {
      for (const key in BORDERS) {
        BORDERS[key] = c(OPT.borderColor,BORDERS[key]);
      }
    }
    
    mat = mat.map(x=>x.map(y=>applyMaxFieldLength(String(y))))
    const matWithBreakLines = mat.map(x=>x.map(y=>y.split("\n")))
  
    const padh = " ".repeat(OPT.paddingH)
  
    if (mat.length === 0) return
    if(!mat.every(line=>Array.isArray(line))) return
  
    //this number contains the colum number (not all rows required to be same length)
    const maxLineLength = mat.reduce((acc,v)=>Math.max(acc,v.length),0)

    //this array contains every row's height
    const maxRowHeight = matWithBreakLines.map(line=>line.reduce((acc,v)=>Math.max(acc,v.length),0))
    const maxRowHeightTotal = maxRowHeight.reduce((acc,v)=>Math.max(acc,v))

    //this array contains every column's width
    const columLengths = Array.from({length:maxLineLength}).fill(0)
    for(let i=0;i<mat.length;i++){ //fila 
      for(let j=0;j<mat[i].length;j++){//columna
        const strLen = matWithBreakLines[i][j].reduce((acc,v)=>Math.max(acc,v.length),0)
        // const strLen = mat[i][j].length
        if(columLengths[j] < strLen){
          columLengths[j] = strLen
        }
      }
    }
  

    const getLineSeparator = (cl=BORDERS.cl,cc=BORDERS.cc,cr=BORDERS.cr)=> {
      const l = OPT.outerBox?cl:""
      const r = OPT.outerBox?cr:""
      return l + columLengths.map(x=>BORDERS.h.repeat(x + OPT.paddingH*2)).join(cc) + r
    }
  
    //PRINT THE TABLE
  
    //outerbox top line
    if(OPT.outerBox){
      result+=getLineSeparator(BORDERS.tl,BORDERS.tc,BORDERS.tr) + "\n"
    }



    function getLine(matLine,i){
      let lineResult = ""
      //outerbox left
      if(OPT.outerBox){
        lineResult+=BORDERS.v
      }
  
      for(let j=0;j<matLine.length;j++){//columna
        const str = matLine[j]
        const endPad = columLengths[j] - str.length
        
        //cell
        let content = padh + str + " ".repeat(endPad) + padh
        if(i===0 && OPT.headerColor){
          content = c(OPT.headerColor,content)
        }else if(OPT.cellColor){
          content = c(OPT.cellColor,content)
        } 
        lineResult += content
  
        //cell separator
        if(j<matLine.length-1){
          lineResult += OPT.verticalSeparator?BORDERS.v:""
        }
      }
  
      //outerbox right
      if(OPT.outerBox){
        lineResult+=BORDERS.v
      }

      return lineResult
    }

    
    // IMPRIME LA TABLA
    for(let i=0;i<mat.length;i++){ //fila 
      
      //an empty line with only separators
      const paddV = getLine(Array.from({length:maxLineLength}).map((_,j)=>" ".repeat(columLengths[j])),i)+"\n"
      
      //top padding
      if(OPT.paddingV > 0){
        result +=  paddV.repeat(OPT.paddingV)
      }

      //line content
      //print all lines rows
      const lineHeight = maxRowHeight[i]
      for(let k=0;k<lineHeight;k++){
        result += getLine(matWithBreakLines[i].map(x=>x[k] || ""),i) + "\n"
      }

      //add lines to equal height
      if(OPT.allRowsEqualHeight && lineHeight < maxRowHeightTotal){
        result+= paddV.repeat(maxRowHeightTotal-lineHeight)
      }

      //bottom padding
      if(OPT.paddingV >0){
        result+= paddV.repeat(OPT.paddingV)
      }


      //line separator
      if(
        (i<mat.length-1 && OPT.separatorAll) ||  //separator between all lines
        (i===0 && OPT.separatorHeader && mat.length>1)  //separator only for header
      ){
        result +=  getLineSeparator() + "\n"
      }
    }
  
    //outerbox bottom
    if(OPT.outerBox){
      result+=getLineSeparator(BORDERS.bl,BORDERS.bc,BORDERS.br)
    }
  
  
    if(OPT.autoConsoleLog){
      console.log(result)
    }
    return result
  }