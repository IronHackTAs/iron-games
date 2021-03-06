function Piece(game) {
  var shapes = [
    [[[0, 0, 1], [0, 0, 1], [1, 1, 1]],
    [[0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0]],
    [[3, 3], [3, 3]]],

    [[[0, 0, 0], [0, 1, 0], [1, 1, 1]],
    [[0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0]],
    [[3, 0, 0], [3, 0, 0], [3, 3, 0]],
    [[0, 0, 4], [0, 0, 4], [0, 4, 4]],
    [[0, 0, 0], [5, 5, 0], [0, 5, 5]],
    [[0, 0, 0], [0, 6, 6], [6, 6, 0]],
    [[7, 7], [7, 7]]],

    [[[0, 0, 0], [0, 1, 0], [1, 1, 1]],
    [[0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0]],
    [[3, 0, 0], [3, 0, 0], [3, 3, 0]],
    [[0, 0, 4], [0, 0, 4], [0, 4, 4]],
    [[0, 0, 0], [5, 5, 0], [0, 5, 5]],
    [[0, 0, 0], [0, 6, 6], [6, 6, 0]],
    [[7, 7], [7, 7]],
    [[0, 8, 0], [8, 8, 8], [8, 0, 8]],
    [[0, 0, 0], [9, 0, 9], [9, 9, 9]],
    [[0, 10, 0], [0, 10, 0], [10, 10, 10]]]
  ];

  this.colors = [
    ,
    "rgb(102, 0, 204)",
    "rgb(0, 255, 255)",
    "rgb(255, 153, 0)",
    "rgb(0, 0, 255)",
    "rgb(0, 255, 0)",
    "rgb(255, 0, 0)",
    "rgb(255, 255, 0)",
    "rgb(153, 51, 0)",
    "rgb(255, 204, 255)",
    "rgb(0, 153, 153)"
  ];
  this.game = game;
  this.speed = this.game.speed;
  this.lateralMove = false;
  
  //phisycal properties
  this.index = parseInt(Math.random() * shapes[this.game.mode].length);
  this.shape = shapes[this.game.mode][this.index];
  this.color = this.colors[this.index+1];
  this.x = this.game.canvas.width / 2;
  this.y = 0;
  this.squareWidth = 35;

  this.calculateBorders();
  this.distanceFromLeft = 5 + this.borderLeft.min;
  this.distanceFromBottom = 20 - this.shape.length - this.borderBottom.min;
}
//Calculates the borders of each piece
Piece.prototype.calculateBorders = function() {
  getBorder = function(matrix) {
    return matrix.map(function(e) {
      if (matrix.length < 4) {
        return e.indexOf(
          matrix[1].filter(function(e2) {
            return e2 != 0;
          })[0]
        );
      } else {
        return e.indexOf(2);
      }
    });
  };
  //border Left
  function borderObj(matrix) {
    (this.border = getBorder(matrix)),
      (this.min = Math.min.apply(
        null,
        this.border.filter(function(e) {
          return e != -1;
        })
      ));
  }
  matrix = this.shape;
  this.borderLeft = new borderObj(matrix);
  // border Top
  matrix = this.transformMatrix(matrix);
  this.borderBottom = new borderObj(matrix);
  // border Right
  matrix = this.transformMatrix(matrix);
  this.borderRight = new borderObj(matrix);
  // border Bottom
  matrix = this.transformMatrix(matrix);
  this.borderTop = new borderObj(matrix);
};
//turns a matrix to right
Piece.prototype.transformMatrix = function(matrix) {
  var result = matrix.map(function(row) {
    return row.map(function(e) {
      return 0;
    });
  });
  matrix.forEach(function(row, rowIndex) {
    row.forEach(function(e, colIndex) {
      result[colIndex][row.length - 1 - rowIndex] = e;
    });
  });
  return result;
};
//Rotate the piece
Piece.prototype.rotate = function() {
  var aux = this.borderTop;
  this.borderTop = this.borderLeft;
  this.borderLeft = this.borderBottom;
  this.borderBottom = this.borderRight;
  this.borderRight = aux;
  //Checks if the piece is out of bounds from the left when turning
  this.shape = this.transformMatrix(this.shape);
  while (this.x + this.borderLeft.min * this.squareWidth < 0) {
    this.moveRight();
  }
  //Checks if the piece is out of bounds from the right when turning
  while (
    this.x + (this.shape.length - this.borderLeft.min) * this.squareWidth >
    this.game.canvas.width
  ) {
    this.moveLeft();
  }
  //recalculate the distance to the edge when rotating
  if (this.borderLeft.min > this.borderTop.min) {
    this.distanceFromLeft += this.borderLeft.min + this.borderTop.min;
  }
  if (this.borderLeft.min < this.borderTop.min) {
    this.distanceFromLeft -= this.borderTop.min + this.borderLeft.min;
  }
  //recalculate the distance to the bottom when rotating
  if (this.borderBottom.min > this.borderLeft.min) {
    this.distanceFromBottom += this.borderBottom.min + this.borderLeft.min;
  }
  if (this.borderBottom.min < this.borderLeft.min) {
    this.distanceFromBottom -= this.borderLeft.min + this.borderBottom.min;
  }
};

//Draws the piece
Piece.prototype.draw = function() {
  this.shape.forEach(
    function(row, rowIndex) {
      row.forEach(
        function(e, colIndex) {
          if (e != 0) {
            this.drawSquare(
              this.x + this.squareWidth * colIndex,
              this.y + this.squareWidth * rowIndex,
              this.squareWidth,
              this.squareWidth,
              e
            );
          }
        }.bind(this)
      );
    }.bind(this)
  );
};

//Draws the little square
Piece.prototype.drawSquare = function(x, y, width, height, colorIndex) {
  this.game.ctx.save();
  this.game.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
  this.game.ctx.strokeRect(x, y, width, height);
  this.game.ctx.fillStyle = this.colors[colorIndex];
  this.game.ctx.fillRect(x+1, y+1, width-2, height-2);
  this.game.ctx.restore();
};
//Moves the piece to the left
Piece.prototype.moveLeft = function() {
  if (this.x + this.borderLeft.min * this.squareWidth > 0) {
    this.x -= this.squareWidth;
    this.distanceFromLeft--;
  }
};
//Moves the piece to the right
Piece.prototype.moveRight = function() {
  if (
    this.x +
      this.shape.length * this.squareWidth -
      this.borderRight.min * this.squareWidth <
    this.game.canvas.width
  ) {
    this.x += this.squareWidth;
    this.distanceFromLeft++;
  }
};
//Moves the piece down
Piece.prototype.moveDown = function() {
  if (
    this.y + (this.shape.length - this.borderBottom.min) * this.squareWidth <
    this.game.canvas.height
  ) {
    this.y += 0.5;
    if (this.y % this.squareWidth == 0) {
      --this.distanceFromBottom;
    }
    this.game.auxBoard.clearBoard();
    this.game.auxBoard.insertPiece(
      this,
      this.distanceFromLeft,
      this.distanceFromBottom
    );
  } else {
    this.clearPiece();
  }
};
//Clears the piece from the canvas and inserts its values on the board
Piece.prototype.clearPiece = function() {
  this.game.ctx.clearRect(
    this.x,
    this.y,
    this.shape.length * this.squareWidth,
    this.shape.length * this.squareWidth
  );
  this.game.board.insertPiece(
    this,
    this.distanceFromLeft,
    this.distanceFromBottom
  );
  this.game.board.draw();
};
