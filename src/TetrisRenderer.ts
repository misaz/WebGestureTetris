class TetrisRenderer {

	private mainCanvas: HTMLCanvasElement;
	private nextPartCanvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private nextPartContext: CanvasRenderingContext2D;
	private tetris: Tetris;

	public constructor(mainCanvas: HTMLCanvasElement, nextPartCanvas: HTMLCanvasElement, tetris: Tetris) {
		if (!mainCanvas) {
			throw "mainCanvas cannot be null";
		}

		if (!nextPartCanvas) {
			throw "nextPartCanvas cannot be null";
		}

		if (!tetris) {
			throw "tetris cannot be null";
		}

		this.tetris = tetris;
		this.mainCanvas = mainCanvas;
		this.nextPartCanvas = nextPartCanvas;
		this.context = mainCanvas.getContext("2d");
		this.nextPartContext = nextPartCanvas.getContext("2d");
	}

	resize() {
		this.mainCanvas.width = this.mainCanvas.parentElement.clientWidth - 40;
		this.mainCanvas.height = this.mainCanvas.parentElement.clientHeight - 40;
	}

	private getRenderingGridDimensions(canvas: HTMLCanvasElement, gridSize: Vector) {
		var cellSizeX = canvas.width / gridSize.x;
		var cellSizeY = canvas.height / gridSize.y;
		var cellSize = Math.min(cellSizeX, cellSizeY);
		var offsetX = canvas.width / 2 - cellSize / 2 * gridSize.x;
		var offsetY = canvas.height / 2 - cellSize / 2 * gridSize.y;

		return new RenderingGridDimensions(offsetX, offsetY, cellSize);
	}

	render() {
		this.renderMainArea();
		this.renderNextPart();
	}

	renderMainArea() {
		this.context.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

		var mapSize = this.tetris.getMapSize();
		var rdim = this.getRenderingGridDimensions(this.mainCanvas, mapSize);

		// render fixed parts
		this.tetris.getFixedCells().getCells().forEach(function (this: TetrisRenderer, c: Cell) {
			var pos = c.getPosition();
			if (pos.x >= 0 && pos.x < mapSize.x && pos.y >= 0 && pos.y < mapSize.y) {
				this.context.fillStyle = c.getColor();
				var x = rdim.offsetX + pos.x * rdim.cellSize;
				var y = rdim.offsetY + pos.y * rdim.cellSize;
				this.context.fillRect(x, y, rdim.cellSize, rdim.cellSize);
			}
		}.bind(this));

		// render active part
		this.tetris.getActivePart().getPartCellsWithAbsolutePositions().forEach(function (this: TetrisRenderer, c) {
			var pos = c.getPosition();
			if (pos.x >= 0 && pos.x < mapSize.x && pos.y >= 0 && pos.y < mapSize.y) {
				this.context.fillStyle = c.getColor();
				var x = rdim.offsetX + pos.x * rdim.cellSize;
				var y = rdim.offsetY + pos.y * rdim.cellSize;
				this.context.fillRect(x, y, rdim.cellSize, rdim.cellSize);
			}
		}.bind(this));

		// render grid
		for (var y = 0; y < mapSize.y; y++) {
			for (var x = 0; x < mapSize.x; x++) {
				this.context.beginPath();
				this.context.strokeStyle = "grey";
				this.context.lineWidth = 1;

				var _x = rdim.offsetX + x * rdim.cellSize;
				var _y = rdim.offsetY + y * rdim.cellSize;
				this.context.rect(_x, _y, rdim.cellSize, rdim.cellSize);
				this.context.stroke();
			}
		}
	}

	renderNextPart() {
		this.nextPartContext.clearRect(0, 0, this.nextPartCanvas.width, this.nextPartCanvas.height);

		var nextPart = this.tetris.getNextPart();

		var rightBorder = nextPart.getRightBorder();
		var leftBorder = nextPart.getLeftBorder();
		var topBorder = nextPart.getTopBorder();
		var bottomBorder = nextPart.getBottomBorder();

		var partOffset = new Vector(-leftBorder, -topBorder);

		var mapSize = new Vector(rightBorder - leftBorder + 1, bottomBorder - topBorder + 1);
		var rdim = this.getRenderingGridDimensions(this.nextPartCanvas, mapSize);

		// render part
		nextPart.getPartCellsWithAbsolutePositions().forEach(function (this: TetrisRenderer, c:Cell) {
			var pos = c.getPosition().add(partOffset);
			if (pos.x >= 0 && pos.x < mapSize.x && pos.y >= 0 && pos.y < mapSize.y) {
				this.nextPartContext.fillStyle = c.getColor();
				var x = rdim.offsetX + pos.x * rdim.cellSize;
				var y = rdim.offsetY + pos.y * rdim.cellSize;
				this.nextPartContext.fillRect(x, y, rdim.cellSize, rdim.cellSize);
			}
		}.bind(this));

		// render grid
		for (var y = 0; y < mapSize.y; y++) {
			for (var x = 0; x < mapSize.x; x++) {
				this.nextPartContext.beginPath();
				this.nextPartContext.strokeStyle = "grey";
				this.nextPartContext.lineWidth = 1;

				var _x = rdim.offsetX + x * rdim.cellSize;
				var _y = rdim.offsetY + y * rdim.cellSize;
				this.nextPartContext.rect(_x, _y, rdim.cellSize, rdim.cellSize);
				this.nextPartContext.stroke();
			}
		}
	}
}