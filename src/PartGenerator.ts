class PartGenerator {

	generateLPart(center: Vector): Part {
		var relativeCellPositions = [
			new Vector(-1, -1),
			new Vector(-1, 0),
			new Vector(-1, 1),
			new Vector(0, 1),
		]
		return new Part(center.add(new Vector(0, -2)), relativeCellPositions, "yellow");
	}

	generateTPart(center: Vector): Part {
		var relativeCellPositions = [
			new Vector(-1, 0),
			new Vector(0, 0),
			new Vector(1, 0),
			new Vector(0, -1),
		]
		return new Part(center.add(new Vector(0, -1)), relativeCellPositions, "blue");
	}

	generateSPart(center: Vector): Part {
		var relativeCellPositions = [
			new Vector(-1, -1),
			new Vector(0, -1),
			new Vector(0, 0),
			new Vector(1, 0),
		]
		return new Part(center.add(new Vector(0, -1)), relativeCellPositions, "green");
	}

	generateIPart(center: Vector): Part {
		var relativeCellPositions = [
			new Vector(0, -2),
			new Vector(0, -1),
			new Vector(0, 0),
			new Vector(0, 1),
		]
		return new Part(center.add(new Vector(0, -2)), relativeCellPositions, "red");
	}

	generateRandomPart(center: Vector): Part {
		var generators = [this.generateIPart, this.generateLPart, this.generateSPart, this.generateTPart];
		var rnd = Math.round(Math.random() * (generators.length - 1));
		return generators[rnd](center);
	}

}