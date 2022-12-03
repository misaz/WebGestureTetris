class TransformSimulator {

	private owningTetris: Tetris;

	constructor(owningTetris: Tetris) {
		this.owningTetris = owningTetris;
	}

	rotatePartLeft(p: Part): Part {
		var rotated = this.rotatePartLeftInternal(p);

		if (this.checkColisonWithFixedParts(rotated)) {
			return p;
		} else {
			return rotated;
		}
	}

	private rotatePartLeftInternal(p: Part): Part {
		var newCellPositions = [];
		p.getPartCellsWithRelativePositions().forEach(function (originalCell) {
			var originalPosition = originalCell.getPosition();
			// var newCell = new Cell(, originalCell.getColor());
			newCellPositions.push(new Vector(originalPosition.y, -originalPosition.x));
		})
		return new Part(p.getCenter(), newCellPositions, p.getColor());
	}

	rotatePartRight(p: Part): Part {
		var rotated = this.rotatePartLeftInternal(this.rotatePartLeftInternal(this.rotatePartLeftInternal(p)));

		if (this.checkColisonWithFixedParts(rotated)) {
			return p;
		} else {
			return rotated;
		}
	}

	canRotateLeft(p: Part) {
		var rotated = this.rotatePartLeftInternal(p);
		return !this.checkColisonWithFixedParts(rotated);
	}

	canRotateRight(p: Part) {
		var rotated = this.rotatePartLeftInternal(this.rotatePartLeftInternal(this.rotatePartLeftInternal(p)));
		return !this.checkColisonWithFixedParts(rotated);
	}

	private checkColisonWithFixedParts(p: Part): boolean {
		var dynamicCells = p.getPartCellsWithAbsolutePositions();
		var fixedCells = this.owningTetris.getFixedCells().getCells();

		for (var i = 0; i < dynamicCells.length; i++) {
			for (var j = 0; j < fixedCells.length; j++) {
				if (dynamicCells[i].getPosition().equals(fixedCells[j].getPosition())) {
					return true;
				}
			}
		}

		return false;
	}

	moveDown(p: Part): Part {
		if (p.getBottomBorder() == this.owningTetris.getMapSize().y - 1) {
			return p;
		}

		var newCenter = p.getCenter().add(new Vector(0, 1));
		var moved = new Part(newCenter, p.getCellsRelativePositions(), p.getColor());

		if (this.checkColisonWithFixedParts(moved)) {
			return p;
		} else {
			return moved;
		}
	}

	canMoveDown(p: Part): boolean {
		if (p.getBottomBorder() == this.owningTetris.getMapSize().y - 1) {
			return false;
		}

		var newCenter = p.getCenter().add(new Vector(0, 1));
		var moved = new Part(newCenter, p.getCellsRelativePositions(), p.getColor());

		var colisonCheck = this.checkColisonWithFixedParts(moved);
		return !colisonCheck;
	}

	moveLeft(p: Part): Part {
		if (p.getLeftBorder() == 0) {
			return p;
		}

		var newCenter = p.getCenter().add(new Vector(-1, 0));
		var moved = new Part(newCenter, p.getCellsRelativePositions(), p.getColor());

		if (this.checkColisonWithFixedParts(moved)) {
			return p;
		} else {
			return moved;
		}
	}

	canMoveLeft(p: Part): boolean {
		if (p.getLeftBorder() == 0) {
			return false;
		}

		var newCenter = p.getCenter().add(new Vector(-1, 0));
		var moved = new Part(newCenter, p.getCellsRelativePositions(), p.getColor());

		return !this.checkColisonWithFixedParts(moved);
	}

	moveRight(p: Part): Part {
		if (p.getRightBorder() == this.owningTetris.getMapSize().x - 1) {
			return p;
		}

		var newCenter = p.getCenter().add(new Vector(1, 0));
		var moved = new Part(newCenter, p.getCellsRelativePositions(), p.getColor());

		if (this.checkColisonWithFixedParts(moved)) {
			return p;
		} else {
			return moved;
		}
	}

	canMoveRight(p: Part): boolean {
		if (p.getRightBorder() == this.owningTetris.getMapSize().x - 1) {
			return false;
		}

		var newCenter = p.getCenter().add(new Vector(1, 0));
		var moved = new Part(newCenter, p.getCellsRelativePositions(), p.getColor());

		return !this.checkColisonWithFixedParts(moved);
	}

	drop(p: Part): Part {
		while (this.canMoveDown(p)) {
			p = this.moveDown(p);
		}
		return p;

		/*
		var mapSize = this.owningTetris.getMapSize();
		var fixedCells = this.owningTetris.getFixedCells();

		var xOffsets = p.getPartCellsWithAbsolutePositions().map(function (x) {
			return x.getPosition().x;
		});

		var minXOffset = Math.min.apply(null, xOffsets);
		var maxXOffset = Math.max.apply(null, xOffsets);

		var maxYbarrier = p.getCenter().y;

		for (var x = minXOffset; x <= maxXOffset; x++) {
			var yOffsets = p.getPartCellsWithAbsolutePositions().filter(function (cell) {
				return cell.getPosition().x == x;
			}).map(function (cell) {
				return cell.getPosition().x;
			});

			var maxYOffset = Math.max.apply(null, yOffsets);
			var ybarrier = p.getCenter().y
			for (var y = maxYOffset + 1; y < mapSize.y; y++) {
				if (!fixedCells.isCellFree(new Vector(x, y))) {
					break;
				}
				ybarrier++;
			}

			if (ybarrier > maxYbarrier) {
				maxYbarrier = ybarrier;
			}
		}

		var newCenter = p.getCenter().add(new Vector(0, maxYbarrier - p.getCenter().y));
		var newCenters = p.getPartCellsWithRelativePositions().map(function (x) { return x.getPosition(); });
		return new Part(newCenter, newCenters, p.getColor());
		*/
	}

}