class FixedCells {

	private cells: Array<Cell>;
	private owningTetris: Tetris;

	constructor(owningTetris: Tetris) {
		this.owningTetris = owningTetris;
		this.cells = [];
	}

	fixPart(part: Part) {
		part.getPartCellsWithAbsolutePositions().forEach(function (this: FixedCells, x) {
			this.cells.push(x);
		}.bind(this));
	}

	getCells(): Cell[] {
		return this.cells;
	}

	isCellFree(pos: Vector) {
		for (var i = 0; i < this.cells.length; i++) {
			if (this.cells[i].getPosition().equals(pos)) {
				return false;
			}
		}
		return true;
	}

	private isLineFull(line: number): boolean {
		var mapSize = this.owningTetris.getMapSize();

		for (var x = 0; x < mapSize.x; x++) {
			if (this.isCellFree(new Vector(x, line))) {
				return false;
			}
		}

		return true;
	}

	private removeLine(line: number) {
		var toRemove = [];
		this.cells.forEach(function (c: Cell) {
			if (c.getPosition().y == line) {
				toRemove.push(c);
			}
		});
		toRemove.forEach(function (this: FixedCells, c: Cell) {
			this.cells.splice(this.cells.indexOf(c), 1);
		}.bind(this));

		// drop all lines above one line down
		this.cells.forEach(function (c: Cell) {
			var pos = c.getPosition();
			if (pos.y < line) {
				pos.y += 1;
			}
		});
	}

	removeFullLines(): number {
		var removedLines = 0;
		var mapSize = this.owningTetris.getMapSize();

		for (var y = mapSize.y - 1; y >= 0; y--) {
			if (this.isLineFull(y)) {
				removedLines++;
				this.removeLine(y);

				// we need to chek this line agian because next line was possibly 
				// also full and after drop it is on the same line as currently 
				// removed line. y++ and later y-- (in for loop definition) will
				// cause that following iteration will run with the same y as 
				// current.
				y++;
			}
		}

		return removedLines;
	}

}