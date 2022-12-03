class Cell {

	private position: Vector;
	private color: string;

	constructor(position: Vector, color: string) {
		this.position = position;
		this.color = color;
	}

	getPosition(): Vector {
		return this.position;
	}

	getColor(): string {
		return this.color;
	}


}