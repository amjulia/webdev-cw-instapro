import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import {
  posts,
  goToPage,
  getToken,
  setPosts,
  page,
  renderApp,
} from "../index.js";
import { likePost, getPosts, deleteLikeOnPost, deletePost } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  const appPosts = posts.map((post) => {
    return {
      id: post.id,
      createdAt: new Date(post.createdAt),
      description: post.description,
      imageUrl: post.imageUrl,
      isLiked: post.isLiked,
      likes: post.likes,
      userId: post.user.id,
      userName: post.user.name,
      userImageUrl: post.user.imageUrl,
      userLogin: post.user.login,
    };
  });

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = appPosts.map((post, index) => {
    console.log(`postUserId ${post.userId}`);
    console.log(`postid ${post.id}`);
    return `
    
        <li class="post" data-index=${index}>
          <div class="post-header" data-user-id=${post.userId}>
              <img src=${post.userImageUrl} class="post-header__user-image">
              <p class="post-header__user-name">${post.userName}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src=${post.imageUrl}>
          </div>
         <div class="like-delete-container">
          <div class="post-likes">
            <button class="like-button" data-post-id=${post.id} data-like=${
      post.isLiked ? "true" : ""
    } >
              <img src=${
                post.isLiked
                  ? `./assets/images/like-active.svg`
                  : `./assets/images/like-not-active.svg`
              }>
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${
                post.likes.length >= 1 ? post.likes[0].name : "0"
              }</strong>
              ${
                post.likes.length - 1 > 0
                  ? " и еще" + " " + (post.likes.length - 1)
                  : ""
              }
            </p>
            
          </div>
          <div class="post-delete"  data-index=${post.index} data-id=${post.id}>
         
          <p class="${post.userId ? "post-delete" : "post-delete-none"}" 
          }">Удалить</p>

          </div>
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
  });

  const conrainerHtml = `
  <div class="page-container">
      <div class="header-container">
      </div>
        <ul class="posts">
        ${appHtml}
        </ul>
  </div>
  `;
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
  initLikeListeners();
  initDeletePost();
}

function initDeletePost() {
  const deleteButtons = document.querySelectorAll(".post-delete");

  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const id = deleteButton.dataset.id;
      console.log(id);

      deletePost({ token: getToken(), id }).then(() => {
        goToPage(page, { userId: deleteButton.dataset.userId });
      });
    });
  }
}
function initLikeListeners() {
  const likeButtons = document.querySelectorAll(".like-button");
  likeButtons.forEach((likeButton, index) => {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const id = likeButton.dataset.postId;

      if (posts[index].isLiked) {
        deleteLikeOnPost({ token: getToken(), id }).then((responseData) => {
          posts[index] = responseData.post;
          setPosts(posts);
          renderPostsPageComponent({ appEl: document.getElementById("app") });
        });
      } else {
        likePost({ token: getToken(), id }).then((responseData) => {
          posts[index] = responseData.post;

          setPosts(posts);

          renderPostsPageComponent({ appEl: document.getElementById("app") });
        });
      }
    });
  });
}
