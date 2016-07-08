import {Pipe} from '@angular/core';

@Pipe({
  name: 'Htmlsafe'
})
export class HtmlsafePipe {
  transform(value, args) {
    value = (value || "").trim();
    if (value.length)
    {
             // this prevents any overhead from creating the object each time
             var element = document.createElement('div');

              // regular expression matching HTML entities
              var entity = /&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);?/ig;

              // find and replace all the html entities
              value = value.replace(entity, function(m) {
                element.innerHTML = m;
                return element.textContent;
              });

            // reset the value
            element.textContent = '';
          }
          return value;
        }
      }