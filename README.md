API DOCUMENTS:

[option]:
	[type](string):
		[simple] means slider of simply images and text without seperate animation.
		[complex] means each slider contains seperate objectes on each contains different animation and time delay etc.

		(default) simple
	[domID](string):the string of id to append the dom to.

	if type is simple:
	
	[showCapital](default:true): display the capital part
	[hover](default:false) sub option for showCapital 
	[animateCapital] swipe up the capital when changing slides.
	[showPaginator](default:true): show paginator part



domID
domId, sliders,option
domID, option[type=simple]

show paginator


1.create dom:
	1) create #sliders
		2) create .page
		3) create .capital append to .page
		4) append .capital to .page
	5) create paginator;
	2)

things to do:
	make copy of variable sliders;
	error check function;

create page dom;
create img; +url +title +alt

Effect:
	stack;
	swipe;
	fade;
	swipe fade;