import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);
  const appPosts = posts.map((post) => {
    return {
      id: post.id,
      createdAt: new Date(),
      description: post.description,
      imageUrl: post.imageUrl,
      isLiked: post.isLiked,
      likes: post.likes,
      userId: post.user.id,
      userName: post.user.name,
      userImageUrl: post.user.imageUrl,
      userLogin: post.user.login
    };
  });

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = appPosts.map((post, index) => {
    return `
    
        <li class="post" data-index=${index}>
          <div class="post-header" data-user-id=${post.userId}>
              <img src=${post.userImageUrl} class="post-header__user-image">
              <p class="post-header__user-name">${post.userName}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src=${post.imageUrl}>
          </div>
          <div class="post-likes">
            <button class="like-button" data-post-id=${post.id} data-like=${post.isLiked ? 'true' : ''} >
              <img src=${post.isLiked ? `./assets/images/like-active.svg` : `./assets/images/like-not-active.svg` }>
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes.length >= 1 ? post.likes[0].name : '0'}</strong>${(post.likes.length-1) > 0 ?  ' и еще' + ' '+ (post.likes.length-1) :''}
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.userName}</span>
           ${post.description}
          </p>
          <p class="post-date">
            ${post.createdAt}
          </p>
        </li>
      `;
  })
  
  const conrainerHtml = `
  <div class="page-container">
      <div class="header-container">
      </div>
        <ul class="posts">
        ${appHtml}
        </ul>
  </div>
  `
  appEl.innerHTML = conrainerHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
