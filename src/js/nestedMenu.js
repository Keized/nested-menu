const nestedMenu = (selector) => {
  const menu = document.querySelector(selector);
  if (!menu) {
    console.log('no menu');
    return;
  }

  for (let subnav of menu.querySelectorAll('.subnav')) {
    const parent = subnav.parentNode;
    const link = parent.querySelector(':scope>a');
    const title = link.cloneNode(true);
    subnav.insertBefore(title, subnav.firstChild);
    title.classList.add('back-nav');
    parent.classList.add('has-subnav');

    link.addEventListener('click', () => {
      subnav.classList.add('active');
    });

    title.addEventListener('click', () => {
      subnav.classList.remove('active');
    })
  }
};

module.exports = nestedMenu;
