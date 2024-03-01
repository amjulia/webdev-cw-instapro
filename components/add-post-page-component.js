import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { sanitazedHtml } from "../helpers.js";
let imageUrl = "";
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <h3 class="form-title">Добавить пост</h3>
    <div class = form-inputs> 
       
          <div class="file-upload-image-conrainer">
            
             <label class="file-upload-label secondary-button add-post">
                <input type="file" class="file-upload-input" style="display:none"/>
                Выберите фото
             </label>
             
          </div>
         
        <p>Опишите фотографию:</p>
          <input type="text"  class="input-comment">
          <button class="button" id="add-button">Добавить</button>
      </div>
    </div>  
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const elElement = document.querySelector(".file-upload-image-conrainer");
    renderUploadImageComponent({
      element: elElement,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });
    const inputComment = document.querySelector(".input-comment");

    inputComment.addEventListener("click", () => {
      inputComment.style.backgroundColor = "white";
      inputComment.value = "";
    });

    document.getElementById("add-button").addEventListener("click", () => {
      if (!imageUrl) {
        alert("Не выбрана фотография");
        return;
      }
      if (inputComment.value === "") {
        inputComment.style.backgroundColor = "pink";
        inputComment.value = "Добавьте описание";
        return;
      }

      onAddPostClick({
        description: sanitazedHtml(inputComment.value),
        imageUrl: imageUrl,
      });
    });
  };

  render();
  imageUrl = "";
}
