---
layout: default
title: Articles
permalink: /articles/
nav_order: 2
nav_exclude: false
---

<h1>Articles</h1>

<ul>
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>
