---
layout: page
linkName: Apps
title: Apps
permalink: /apps/
---

<div class="home">

  <!--h1 class="page-heading">应用App</h1-->
  <ul class="blog-list app-list">
    {% for post in site.posts %}
      {% if post.categories contains "app" %}
      <li>
        <a class="post-list-link" href="{{ post.url | prepend: site.baseurl }}">
            <div class="post-list-show-image">
              <div class="post-list-show-image-image" bg="{{ post.appicon }}">
              </div>
            </div>
            <div class="post-list-title">{{ post.title }}</div>
            <div class="post-list-description">{{ post.description }}</div>
        </a>
        <!--div class="post-list-info">
        <a class="post-app-link link-button" href="{{ post.appstorelink }}">AppStore</a>
        </div-->
      </li>
      {% endif %}
    {% endfor %}

  </ul>
</div>
<style>
  .page-content:before {
    background-image: url('/images/{{ page.title }}.jpg');
    display: block;
  }

  .page-content:after {
    display: block;
  }
</style>

<script>
  // 检查浏览器是否支持webp
  function isSupportWebP() {
    return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
  }

  // 如果支持webp,则在img标签src上添加后缀
  const imgList = document.querySelectorAll('.post-list-show-image-image');
 var i=0;
  if (isSupportWebP()) {
    imgList.forEach(img => {
      let src = img.getAttribute('bg');
      img.style.backgroundImage = "url('" + src + "')";
      setTimeout(function(){img.style.opacity=1;},100+300*i);
      i++;
    });
  } else {
    imgList.forEach(img => {
      let src = img.getAttribute('bg');
      img.style.backgroundImage = "url('" + src + "')";
      setTimeout(function(){img.style.opacity=1;},300+300*i);
      i++;
    });

  }
</script>
