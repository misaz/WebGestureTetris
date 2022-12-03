class Tetris {

	private mapSize: Vector;
	private fixedCells: FixedCells;
	private activePart: Part;
	private nextPart: Part;
	private nextPartGenerator: PartGenerator;
	private nextPartStartPosition: Vector;
	private transformSimulator: TransformSimulator;
	private score: number;
	private gameOver: boolean;

	constructor(width: number, height: number) {
		this.mapSize = new Vector(width, height);
		this.fixedCells = new FixedCells(this);
		this.transformSimulator = new TransformSimulator(this);
		this.nextPartGenerator = new PartGenerator();
		this.nextPartStartPosition = new Vector(Math.floor(this.mapSize.x / 2), 0);
		this.activePart = this.nextPartGenerator.generateRandomPart(this.nextPartStartPosition);
		this.nextPart = this.nextPartGenerator.generateRandomPart(this.nextPartStartPosition);
		this.score = 0;
		this.gameOver = false;
	}

	getMapSize(): Vector {
		return this.mapSize;
	}

	getFixedCells(): FixedCells {
		return this.fixedCells;
	}

	getActivePart(): Part {
		return this.activePart;
	}

	getNextPart(): Part {
		return this.nextPart;
	}

	getScore(): number {
		return this.score;
	}

	isGameOver(): boolean {
		return this.gameOver;
	}

	doStep() {
		if (this.gameOver) {
			return;
		}

		if (!this.transformSimulator.canMoveDown(this.activePart)) {
			this.fixedCells.fixPart(this.activePart);
			this.score += this.fixedCells.removeFullLines();
			this.activePart = this.nextPart;
			this.nextPart = this.nextPartGenerator.generateRandomPart(this.nextPartStartPosition);

			// if new part can't move, game is over
			if (!this.transformSimulator.canMoveDown(this.activePart)) {
				this.gameOver = true;
			}
			return;
		}

		var moved = this.transformSimulator.moveDown(this.activePart);
		this.activePart.setCenter(moved.getCenter());
	}

	moveLeft() {
		if (this.gameOver) {
			return;
		}

		var moved = this.transformSimulator.moveLeft(this.activePart);
		this.activePart.setCenter(moved.getCenter());
	}

	moveRight() {
		if (this.gameOver) {
			return;
		}

		var moved = this.transformSimulator.moveRight(this.activePart);
		this.activePart.setCenter(moved.getCenter());

	}

	drop() {
		if (this.gameOver) {
			return;
		}

		var dropped = this.transformSimulator.drop(this.activePart);
		this.activePart.setCenter(dropped.getCenter());
	}

	rotateRight() {
		if (this.gameOver) {
			return;
		}

		if (!this.transformSimulator.canRotateLeft(this.activePart)) {
			return;
		}

		var rotated = this.transformSimulator.rotatePartRight(this.activePart);
		this.activePart.setCellWithRelativePositions(rotated.getPartCellsWithRelativePositions());
	}

	rotateLeft() {
		if (this.gameOver) {
			return;
		}

		if (!this.transformSimulator.canRotateRight(this.activePart)) {
			return;
		}

		var rotated = this.transformSimulator.rotatePartLeft(this.activePart);
		this.activePart.setCellWithRelativePositions(rotated.getPartCellsWithRelativePositions());
	}

}