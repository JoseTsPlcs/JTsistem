

class EditableImage extends ODD {

  constructor({parent, imageUrl}) {

    super({parent,imageUrl});
    this.parentElement = parent;
    this.imageUrl = imageUrl;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    this.uniqueId = `editable-image-${Math.random().toString(36).substr(2, 9)}`;

    this.init();
  }

  init() {
    // Create the container div
    this.div = document.createElement('div');
    this.div.classList.add('editable-image-container');

    // Create the canvas
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('editable-image-canvas');
    this.canvas.id = this.uniqueId;
    this.div.appendChild(this.canvas);
    this.parentElement.appendChild(this.div);

    // Get the context of the canvas
    this.ctx = this.canvas.getContext('2d');

    // Load the initial image
    this.loadImage(this.imageUrl);

    // Add event listeners for drawing
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

    // Create the button container
    this.buttonContainer = document.createElement('div');
    this.buttonContainer.classList.add('button-container', 'mt-3');
    this.parentElement.appendChild(this.buttonContainer);

    // Create the clear button
    this.clearButton = document.createElement('button');
    this.clearButton.classList.add('btn', 'btn-danger', 'mr-2');
    this.clearButton.textContent = 'Borrar Ediciones';
    this.clearButton.addEventListener('click', this.clearEdits.bind(this));
    this.buttonContainer.appendChild(this.clearButton);

    // Create the save button
    /*this.saveButton = document.createElement('button');
    this.saveButton.classList.add('btn', 'btn-success');
    this.saveButton.textContent = 'Guardar';
    this.saveButton.addEventListener('click', this.ImageGet.bind(this));
    this.buttonContainer.appendChild(this.saveButton);*/
  }

  loadImage(imageUrl) {
    this.originalImage = new Image();
    this.originalImage.onload = () => {
      const ratio = this.originalImage.height / this.originalImage.width;
      var canvasWidth = this.parentElement.clientWidth
      var canvasHeight = canvasWidth * ratio;
      //canvasHeight = canvasWidth = 600;
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      this.ctx.drawImage(this.originalImage, 0, 0, canvasWidth, canvasHeight);
    };
    this.originalImage.src = imageUrl;
  }

  startDrawing(e) {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
  }

  draw(e) {
    if (!this.isDrawing) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
    this.lastX = x;
    this.lastY = y;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearEdits() {
    this.loadImage(this.imageUrl);
  }

  ImageGet() {
    const image = this.canvas.toDataURL('image/png');
    return image;
    //console.log('Imagen guardada:', image);
  }

  changeImage(newImageUrl) {
    this.imageUrl = newImageUrl;
    this.loadImage(newImageUrl);
  }

}