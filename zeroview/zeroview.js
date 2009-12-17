/*
 * [0]:zeroview is published under MIT License.
 * Copyright © 2008 Taiyo Fujii.
 * Copyright © 2009 Norio Kobota.(chrome extensions)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// repetition control
if (document.body.Target_frame) {
    return;
}

//Variables
var target = document.body;
var target_height = window.innerHeight;
var original_page_height = target.scrollHeight;
var original_page_scroll = window.pageYOffset;
var orgiginal_page_width = target.scrollWidth;

//Calculating scale
var target_scale = Math.max(target_height/original_page_height, 0.2);

//CSS Animation
target.style.webkitTransition = '-webkit-transform 0.5s ease-in';
target.style.webkitTransformOrigin = orgiginal_page_width / 2 + 'px 0';

//Scrolling to top
goSmooth = setInterval('go_smooth(0)', 10);
setTimeout('stop_scroll\(0\)', 500);

//Creating target frame
var target_frame = document.createElement('div');
target_frame.style.position = 'absolute';
target_frame.style.width = orgiginal_page_width + 'px';
target_frame.style.height = target_height + 'px';
target_frame.style.top = original_page_scroll + 'px';
target_frame.style.border = 'solid ' + 2/target_scale + 'px rgb(40, 20, 10)';
target_frame.style.backgroundColor = 'rgba(255, 120, 10, 0.2)';
target_frame.style.zIndex = '99999';
target_frame.style.webkitBorderRadius = 5 / target_scale + 'px';
target.appendChild(target_frame);
target.Target_frame = target_frame;

//Webkit scaling CSS to target frame
target.style.webkitTransform = 'scale('+target_scale+')';

//Adding event for recovering normal view
target.Target_frame.addEventListener('click', function(e){reset(e, target_scale)}, true);
target.addEventListener('mousemove', function(e){moveTarget(e, target_scale);}, true);

//Recovering page view style
function reset(e, target_scale){
    var target_frame = document.body.Target_frame;
    var scrollY = Math.floor(target_frame.style.top.replace('px',''));
    document.body.removeChild(target_frame);
    document.body.Target_frame = null;

    //CSS Animation for recovering
    document.body.style.webkitTransform = 'scale(1)';
    goSmooth = setInterval('go_smooth('+scrollY+')', 10);
    setTimeout('stop_scroll\('+scrollY+'\)', 500);
    document.body.removeEventListener('mousemove', function(e){moveTarget(e, target_scale);}, true );
    e.stopPropagation();
}

//Target frame mover
function moveTarget(e, target_scale){
    var page_offset = window.pageYOffset;
    var t_frame = document.body.Target_frame;
    if (!t_frame) {
	return;
    }
    var t_frame_height = t_frame.offsetHeight;
    var pageHeight = target.scrollHeight;
    var topHeight = (e.clientY / target_scale) - (t_frame_height / 2) + (page_offset / target_scale);
    if(topHeight < 0)topHeight = 0;
    if( (topHeight + t_frame_height) > pageHeight)topHeight = pageHeight - t_frame_height;
    t_frame.style.top = topHeight + 'px';
}

//Scrolling functions
function go_smooth(goal){
    var page_offset=window.pageYOffset;
    var increment = (goal - page_offset) / 50;
    if(increment > goal){
	increment = 0;
	clearInterval(goSmooth);
    }
    window.scrollBy(0, increment);
}

function stop_scroll(goal){
    clearInterval(goSmooth);
    window.scrollTo(0, goal);
}

/* EOF */
