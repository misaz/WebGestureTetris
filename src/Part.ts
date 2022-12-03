class Part {

	private cells: Array<Cell>;
	private center: Vector;
	private color: string;

	constructor(center: Vector, cellOffsets: Array<Vector>, color: string) {
		this.center = center;
		this.cells = [];
		cellOffsets.forEach(function (this: Part, x) {
			this.cells.push(new Cell(x, color));
		}.bind(this));
		this.color = color;
	}

	getPartCellsWithRelativePositions(): Array<Cell> {
		return this.cells;
	}

	getPartCellsWithAbsolutePositions(): Array<Cell> {
		var output = [];
		this.cells.forEach(function (this: Part, x: Cell) {
			output.push(new Cell(x.getPosition().add(this.center), x.getColor()));
		}.bind(this));
		return output;
	}

	replaceCellsWithRelativePositions(newCells: Array<Cell>) {
		this.cells = newCells;
	}

	setCenter(newCenter: Vector) {
		this.center = newCenter;
	}

	setCellWithRelativePositions(newCells: Array<Cell>) {
		this.cells = newCells;
	}

	getCenter(): Vector {
		return this.center;
	}

	getColor(): string {
		return this.color;
	}

	getLeftBorder(): number {
		var xOffsets = this.getPartCellsWithAbsolutePositions().map(function (x) {
			return x.getPosition().x;
		});

		return Math.min.apply(null, xOffsets);
	}

	getRightBorder(): number {
		var xOffsets = this.getPartCellsWithAbsolutePositions().map(function (x) {
			return x.getPosition().x;
		});

		return Math.max.apply(null, xOffsets);
	}

	getBottomBorder(): number {
		var yOffsets = this.getPartCellsWithAbsolutePositions().map(function (x) {
			return x.getPosition().y;
		});

		return Math.max.apply(null, yOffsets);
	}

	getTopBorder(): number {
		var yOffsets = this.getPartCellsWithAbsolutePositions().map(function (x) {
			return x.getPosition().y;
		});

		return Math.min.apply(null, yOffsets);
	}

	getCellsRelativePositions(): Vector[] {
		return this.cells.map(function (x) { return x.getPosition(); })
	}

}