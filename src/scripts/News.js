class News {
  async getNews() {
    const response = await fetch('https://covid-19-news.p.rapidapi.com/v1/covid?q=covid&lang=en&media=True', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '4b8e988824msh7043d52316bc68ep1923c3jsn003143a0f07b',
        'x-rapidapi-host': 'covid-19-news.p.rapidapi.com'
      }
    });
    const data = await response.json();
    return data.articles;
  }

  async createNewsList() {
    const data = await this.getNews();
    const fragment = document.createDocumentFragment();
    const defaultImage = '../assets/images/default-news.jpg';
    data.forEach((item) => {
      const newsLink = document.createElement('a');
      newsLink.classList.add('news-link');
      newsLink.setAttribute('href', item.link);
      newsLink.setAttribute('target', '_blank');
      newsLink.innerHTML = `
      <div class='news-block'>
      <img src=${item.media ? item.media : defaultImage} class='news-block__image'>
        <h4 class='news-block__title'>${item.title}</h4>
        <h5 class='news-block__date'>Published: ${item.published_date.slice(0, 10)}</h5>
      </div>
      `;
      fragment.append(newsLink);
    });
    return fragment;
  }
}

export default News;
