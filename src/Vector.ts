class Vector {
	public x: number;
	public y: number;

	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public add(v: Vector): Vector {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	public equals(v: Vector): boolean {
		return v.x == this.x && v.y == this.y;
	}
}