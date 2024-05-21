(async function (){

  let input = document.querySelector('input[type="file"]')

  if (!input.files || input.files.length === 0) return;

  const reader = new FileReader();
  const maxWidth = 768; // Largura máxima da imagem em pixels

  reader.onload = function(e) {
    const image = new Image();
    image.src = e.target.result;

    image.onload = function() {
      const originalWidth = image.width;
      const originalHeight = image.height;

      let newWidth = originalWidth;
      let newHeight = originalHeight;

      if (originalWidth > maxWidth) {
        const ratio = maxWidth / originalWidth;
        newWidth = maxWidth;
        newHeight = originalHeight * ratio;
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, newWidth, newHeight);

      const dataURL = canvas.toDataURL('image/jpeg', 0.8); // Ajustar a qualidade da imagem (0.8 para boa qualidade)

      // Exibir a imagem redimensionada (você pode usar essa dataURL para criar um novo elemento img ou fazer o que quiser com ela)
      const imgElement = document.createElement('img');
      imgElement.src = dataURL;
      document.body.appendChild(imgElement);
    };
  };

  for (let i = 0; i < input.files.length; i++) {
    const file = input.files[i];
    reader.readAsDataURL(file);
  }

})()