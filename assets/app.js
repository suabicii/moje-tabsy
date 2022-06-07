/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';

import './styles/scss/style.scss';

const iconSupportComment = document.createComment('Pills icon (https://icons8.com/icon/TVnUXgvxP4uk/pills) by Icons8 (https://icons8.com)');
document.querySelector('html').append(iconSupportComment);
