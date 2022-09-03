import {
    trigger,
    animate,
    transition,
    style,
    query
  } from '@angular/animations';
  
  export const fadeAnimation = trigger('fadeAnimation', [
    // The '* => *' will trigger the animation to change between any two states
    transition('* => *' , [
      
      style({ opacity: 0 }), 
      
      
      animate('0.3s', style({ opacity: 1 }))
    ]),
  ]);
  