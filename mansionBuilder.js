var sketchProc=function(processingInstance){ with (processingInstance){

  size(400, 400);
  frameRate(30);

  var brickLong;
  var brickTall;
  var brickDeep;
  var trimW;
  var shingleW;
  var shingleH;
  var shingleFill = color(79, 69, 43);
  var shingleStroke = color(13, 11, 6);
  var brickColor = color(180,80,30);

  var isOdd = function(n){
      return n % 2 === 1;
  };

  var drawBricks = function(baseX,baseY,brickOrientation,bricksAcross,bricksTall){
      var brickW;
      var brickH;
      //for below windows
      if(brickOrientation === -1){
          brickW = brickTall;
          brickH = brickDeep;
      //for above windows
      } else if(brickOrientation === 1){
          brickW = brickTall;
          brickH = brickLong;
      //for standard walls
      } else{
          brickW = brickLong;
          brickH = brickTall;
      }
      stroke(145, 130, 130);
      var wallW = bricksAcross * brickW;
      var wallH = bricksTall * brickH;
      var wallX = baseX;
      var wallY = baseY - wallH;
      var firstBrickW = floor(brickW);
      var brickX;
      var brickY;
      //draw staggered bricks
      for(var row = 0; row < bricksTall; row++){
          fill(brickColor);
          brickY = wallY + brickH * row;
          //short brick for wall orientation
          if(brickOrientation === 0){
              if(isOdd(row)){
                  firstBrickW = ceil(brickW / 2);
              } else{
                  firstBrickW = floor(brickW);
              }
          }
              //first brick
              rect(wallX,brickY,firstBrickW,brickH);
              //last brick
              if(firstBrickW < brickW){
                  rect(wallX+wallW-firstBrickW,brickY,firstBrickW,brickH);
          }
          //skip brick 0
          for(var brick = 1; brick < bricksAcross; brick++){
              brickX = wallX + firstBrickW + brickW * (brick - 1);
              rect(brickX,brickY,brickW,brickH);
          }
      }
      stroke(0, 0, 0);
      noFill();
      rect(wallX,wallY,wallW,wallH);
  };

  var getRowXDiff = function(yPos,y,h,slope){
      return (yPos - y + h) / slope;
  };

  var getPeakY = function(xPos,y,h,midX,slope){
      return y - h + (slope * abs(xPos - midX));
  };

  var drawPeak = function(centerX,triY,shinglesAcross,shinglesTall){
      fill(shingleFill);
      stroke(shingleStroke);

      var triW = shinglesAcross * shingleW;
      var triH = shinglesTall * shingleH;
      var triX = centerX - triW/2;
      var triMidX = triX+triW/2;
      var triSlope = triH/(triMidX-triX);

      //draw peak
      triangle(triX,triY,triMidX,triY-triH,triX+triW,triY);

      var rowY;
      var shingleX;
      var firstShingleW = shingleW;
      var yCutoff;

      for(var row = 0; row < shinglesTall; row++){
          rowY = triY - triH + shingleH * row;
          //draw shingle row
          var xDiff = getRowXDiff(rowY,triY,triH,triSlope);
          line(triMidX - xDiff,rowY,triMidX + xDiff,rowY);

          //draw staggered shingles
          if(!isOdd(row)){
              firstShingleW = shingleW/2;
          } else{
              firstShingleW = shingleW;
          }

          for(var shingle = 0; shingle < shinglesAcross; shingle++){
              shingleX = triX + firstShingleW + shingleW * shingle;
              yCutoff = getPeakY(shingleX,triY,triH,triMidX,triSlope);
              //skip lines fully off of peak
              if(yCutoff < rowY){
                  line(shingleX,rowY,shingleX,rowY+shingleH);
              } //draw lines partially within peak
              else if(yCutoff < rowY + shingleH){
                  line(shingleX,yCutoff,shingleX,rowY + shingleH);
              }
          }
      }
      stroke(0, 0, 0);
      noFill();
      triangle(triX,triY,triMidX,triY-triH,triX+triW,triY);
  };

  var drawRoof = function(baseX,baseY,shinglesAcross,shinglesTall){
      fill(shingleFill);
      stroke(shingleStroke);

      var roofW = shinglesAcross * shingleW;
      var roofH = shinglesTall * shingleH;
      var roofX = baseX - roofW / 2;
      var roofY = baseY - roofH;

      //draw roof
      rect(roofX,roofY,roofW,roofH);

      var rowY;
      var shingleX;
      var firstShingleW = floor(shingleW);

      for(var row = 0; row < shinglesTall; row++){
          rowY = roofY + shingleH * row;
          //draw shingle row
          line(roofX,rowY,floor(roofX + roofW),rowY);
          //draw staggered shingles
          if(isOdd(row)){
              firstShingleW = floor(shingleW / 2);
          } else{
              firstShingleW = floor(shingleW);
          }

          for(var shingle = 0; shingle < shinglesAcross; shingle++){
              shingleX = roofX + firstShingleW + shingleW * shingle;
                  line(shingleX,rowY,shingleX,floor(rowY + shingleH));
              }
          }
      stroke(0, 0, 0);
      noFill();
      rect(roofX,roofY,roofW,roofH);
  };

  var drawWindow = function(centerX,centerY,bricksAcross,bricksTall,paneColumn,paneRow,frameThick,sillEnabled,mouldEnabled){
      var frameW = ceil(bricksAcross * brickLong);
      var frameH = ceil(bricksTall * brickTall);
      var frameX = ceil(centerX - frameW / 2);
      var frameY = ceil(centerY - frameH / 2);
      var grillThick = frameThick * 0.5;
      var glassX = ceil(centerX - frameW / 2 + frameThick);
      var glassY = ceil(centerY - frameH / 2 + frameThick);
      var glassW = floor(frameW - 2 * frameThick);
      var glassH = floor(frameH - 2 * frameThick);
      var paneW = glassW / paneColumn;
      var paneH = glassH / paneRow;
      var rowY;
      var columnX;
      var brickW = floor(frameW / brickTall) + 1;
      var brickX = ceil(centerX - ((brickW * brickTall) / 2));
      //draw frame
      fill(255, 255, 255);
      rect(frameX,frameY,frameW,frameH);
      //draw glass
      stroke(255, 255, 255);
      strokeWeight(grillThick);
      fill(151, 201, 209);
      rect(glassX,glassY,glassW,glassH);
      //draw rows
      for(var rowNum = 0; rowNum < paneRow-1; rowNum++){
          rowY = glassY + (rowNum + 1) * paneH;
          line(glassX,rowY,glassX + glassW,rowY);
      }
      //draw panes
      for(var colNum = 0; colNum < paneColumn; colNum++){
          columnX = glassX + colNum * paneW;
          line(columnX,glassY,columnX,glassY + glassH);
      }
      stroke(0, 0, 0);
      strokeWeight(1);
      noFill();
      rect(frameX,frameY,frameW,frameH);

      //draw sill
      if(sillEnabled){
          drawBricks(brickX,frameY + frameH + brickDeep,-1,brickW,1);
      }
      //draw mould
      if(mouldEnabled){
          drawBricks(brickX,frameY,1,brickW,1);
      }
  };

  var drawDoor = function(centerX,baseY,tranBricksAcross,bricksTall){
      var doorBaseY = baseY - brickDeep;
      var sideWinBricksAcross = 1;
      var doorBricksAcross = tranBricksAcross - sideWinBricksAcross * 2;
      var centerBricksTall = bricksTall / 2 + 2;

      var frameW = floor(doorBricksAcross * brickLong);
      var frameH = floor(bricksTall * brickTall);
      var frameX = floor(centerX - frameW / 2);
      var frameY = floor(doorBaseY - frameH);

      var doorW = floor(frameW - 2 * trimW);
      var doorH = floor(frameH - 2 * trimW);
      var doorX = floor(centerX - doorW / 2);
      var doorY = floor(doorBaseY - doorH - trimW);

      var knobX = doorX + doorW * 0.9;
      var knobY = doorY + doorH * 0.6;
      var knobW = brickTall * 0.8;

      var doorWinY = doorY + doorH * 0.245;
      var doorWinTrimW = trimW * 0.6;

      var brickW = ceil((tranBricksAcross * brickLong) / brickTall + 1);
      var brickX = ceil(centerX - floor((brickW * brickTall) / 2));

      var topWinY = doorBaseY - ceil((bricksTall + 1.4) * brickTall);
      var sideWinY = frameY + frameH / 2;
      var leftWinX = frameX - brickLong / 2;
      var rightWinX = frameX + frameW + brickLong / 2;

      //draw frame
      fill(255, 255, 255);
      rect(frameX,frameY,frameW,frameH);
      //draw door
      fill(40, 103, 166);
      rect(doorX,doorY,doorW,doorH);
      //draw knob
      fill(255, 204, 0);
      ellipse(knobX,knobY,knobW,knobW);
      //draw glazing
      drawWindow(centerX,doorWinY,2,5,3,2,doorWinTrimW,false,false);
      //draw transom
      drawWindow(leftWinX,sideWinY,sideWinBricksAcross,bricksTall,1,6,trimW,false,false);
      drawWindow(rightWinX,sideWinY,sideWinBricksAcross,bricksTall,1,6,trimW,false,false);
      drawWindow(centerX,topWinY,tranBricksAcross,3,7,1,trimW,false,false);
      drawBricks(brickX,baseY,-1,brickW,1);
  };

  var drawFacade = function(centerX,baseY,bricksAcross,bricksTall,winBricksAcross,winBricksTall,winBricksBetweenW,winBricksBetweenH,extraBufferBricks){
      var wallW = bricksAcross * brickLong;
      var wallH = bricksTall * brickTall;
      var baseX = centerX - wallW / 2;
      var roofY = baseY - wallH;
      //tower ceiling starts lower than facade tower, but is taller
      var shinglesTall = min((floor((bricksTall - 1) * 0.15)),winBricksTall);
      var shinglesAcross = round(wallW / shingleW);

      drawBricks(baseX,baseY,0,bricksAcross,bricksTall);
      if(shinglesTall > 0){
          drawRoof(centerX,roofY,shinglesAcross + 2,shinglesTall);
      }

      //windows
      var winPeriodW = (winBricksAcross + winBricksBetweenW) * brickLong;
      var winBufferW = (winBricksAcross / 2 + winBricksBetweenW + extraBufferBricks - 0.5) * brickLong;
      var winViableMinX = baseX + winBufferW;
      var winViableMaxX = baseX + wallW - winBufferW;
      var winPeriodH = winBricksBetweenH * brickTall;
      var winBufferH = (winBricksBetweenH / 2 + 1) * brickTall;
      var winViableMinY = baseY - wallH + winBufferH;

      var winXOffset;
      var startingY = baseY - brickTall * 11.9;
      var winY = startingY;
      while(winY >= winViableMinY){
          winXOffset = 0;
          while(winXOffset <= ceil(winViableMaxX - centerX)){
              if(winY !== startingY || winXOffset !== 0){
                  drawWindow(centerX + winXOffset,winY,winBricksAcross,winBricksTall,3,4,trimW,true,true);
                  drawWindow(centerX - winXOffset,winY,winBricksAcross,winBricksTall,3,4,trimW,true,true);
              }
              winXOffset += winPeriodW;
          }
          winY -= winPeriodH;
      }
      drawDoor(centerX,baseY,5,16.1);
  };

  var drawTower = function(centerX,baseY,bricksAcross,bricksTall,winBricksAcross,winBricksTall,winBricksBetweenW,winBricksBetweenH){
      var wallW = bricksAcross * brickLong;
      var wallH = bricksTall * brickTall;
      var baseX = centerX - wallW / 2;
      var peakY = baseY - wallH;
      //tower ceiling starts lower than facade tower, but is taller
      var shinglesTall = min((floor(bricksTall * 0.15) + 1),winBricksTall + 1);
      var shinglesAcross = round(wallW / shingleW) + 2;
      //allow towers to hide
      if(bricksAcross > 0){
          drawBricks(baseX,baseY,0,bricksAcross,bricksTall);
          if(shinglesTall > 1){
              drawPeak(centerX,peakY,shinglesAcross,shinglesTall);
          }
      }
      //windows
      var winPeriodW = (winBricksAcross + winBricksBetweenW) * brickLong;
      var winBufferW = (winBricksAcross / 2 + winBricksBetweenW - 0.5) * brickLong;
      var winViableW = wallW - winBufferW * 2;
      var winViablePeriodsW = floor(winViableW / winPeriodW);
      var winViableRangeW = (winViablePeriodsW * winPeriodW) / 2;
      var winViableMinX = centerX - winViableRangeW;
      var winViableMaxX = ceil(centerX + winViableRangeW);
      var winPeriodH = winBricksBetweenH * brickTall;
      var winBufferH = (winBricksBetweenH / 2 - 0) * brickTall;
      var winViableMinY = ceil(peakY + winBufferH);

      var winY = baseY - brickTall * 11.9;
      var winX;
      while(winY >= winViableMinY){
          winX = winViableMinX;
          while(winX <= winViableMaxX){
              drawWindow(winX,winY,winBricksAcross,winBricksTall,3,4,trimW,true,true);
              winX += winPeriodW;
          }
          winY -= winPeriodH;
      }
  };

  var drawHouse = function(centerX,baseY,facadeWInput,facadeHInput,towerWInput,towerHInput){
      var facadeBricksAcross = round(facadeWInput);
      var facadeBricksTall = round(facadeHInput);
      var towerBricksAcross = round(towerWInput);
      var towerBricksTall = round(towerHInput);

      var windowW = 3;
      var windowH = 12;
      var windowSpaceW = 2;
      var windowSpaceH = 21;
      var towerXOffset = ((facadeBricksAcross + 1) * brickLong / 2);
      var lTowerX = centerX - towerXOffset;
      var rTowerX = centerX + towerXOffset;
      //no windows behind towers
      var facadeExtraWinBuffer = towerBricksAcross / 2;

      drawFacade(centerX,baseY,facadeBricksAcross,facadeBricksTall,windowW,windowH,windowSpaceW,windowSpaceH,facadeExtraWinBuffer);
      if(towerBricksTall > 0){
          drawTower(lTowerX,baseY,towerBricksAcross,towerBricksTall,windowW,windowH,windowSpaceW,windowSpaceH);
          drawTower(rTowerX,baseY,towerBricksAcross,towerBricksTall,windowW,windowH,windowSpaceW,windowSpaceH);
      }
  };

  var drawTestPieces = function(){
      brickLong = 24;
      drawBricks(42,338,2,6,15);
      drawWindow(319,110,3,14,3,4,trimW,true,true);
      drawPeak(139,190,18,4);
      drawRoof(139,95,18,4);
      drawDoor(320,370,3,15,0.3);
  };

  brickLong = 22;//22 max //7 min
  var facadeWidth = 16; //39 max //16 min
  var towerWidth = 0; //11 max //0 min
  var houseHeight = 24; //132 max //24 min

  var towerHeightAnim = 0.00;
  var towerHeight;

  var loopCount = 0;
  var animLength = 200;
  var animFrame;

  var draw = function() {
      background(219, 255, 255);

      brickTall = brickLong / 3;
      brickDeep = brickLong * 0.6;
      shingleW = brickLong / 2;
      shingleH = brickLong * 2/3;
      trimW = brickLong * 0.2;
      towerHeight = round((houseHeight - 1) * towerHeightAnim);

      drawHouse(200,360,facadeWidth,houseHeight,towerWidth,towerHeight);
      //drawTestPieces();

      loopCount++;
      animFrame = loopCount % animLength;

      if(animFrame === 0){
          brickLong = 22;
          facadeWidth = 16;
          towerWidth = 0;
          houseHeight = 24;
          towerHeightAnim = 0.00;
      }

      //animate
      if(animFrame > 45 && houseHeight < 45){
          houseHeight += 0.5;
      }
      if(animFrame > 40 && brickLong > 16){
          brickLong -= 0.1;
      }
      if(animFrame > 90 && facadeWidth < 23){
          facadeWidth += 1;
      }
      if(animFrame > 90 && towerWidth < 2){
          towerWidth += 1;
      }
      if(animFrame > 90 && brickLong > 11.5){
          brickLong -= 0.1;
      }
      if(animFrame > 100 && towerHeightAnim < 0.53){
          towerHeightAnim += 0.02;
      }
      if(animFrame > 130 && towerWidth < 6){
          towerWidth += 1;
      }
      if(animFrame > 140 && houseHeight < 67){
          houseHeight += 1.5;
      }
      if(animFrame > 140 && towerHeightAnim < 0.68){
          towerHeightAnim += 0.01;
      }
      if(animFrame > 160 && facadeWidth < 28){
          facadeWidth += 2;
      }
      if(animFrame > 160 && towerWidth < 12){
          towerWidth += 1.5;
      }
      if(animFrame > 140 && brickLong > 8){
          brickLong -= 0.1;
      }
      if(animFrame > 165 && towerHeightAnim < 0.99){
          towerHeightAnim += 0.04;
      }
      if(animFrame > 175 && facadeWidth < 39){
          facadeWidth += 3;
      }
      if(animFrame > 165 && brickLong > 7){
          brickLong -= 0.1;
      }
      if(animFrame > 180 && houseHeight < 86){
          houseHeight += 4;
      }
  };

}};

var canvas = document.getElementById('myCanvas');
// attaching the sketchProc function to the canvas
var processingInstance = new Processing(canvas, sketchProc);
