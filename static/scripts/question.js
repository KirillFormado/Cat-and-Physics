(function ($) {
	var //question id constants 
			NEWTOWNSECONLAW_ID = 'newtownSecondLaw',
			CAMBIAR_ID = 'cambiar',
			CHANCE_ID = 'chance',
			WAVELIKE_ID = 'waveLike';

	    ///////////////////////////////////////
        //questions handlers
        function Question(id, answer) {
            this.id = id;
            this.answer = answer;
            this.save = function () {
                storageWrapper.PutInLocal(id, answer);				
            };
        }
		
        $('.answerButton').on('click', function () {
            var button = $(this);
            //var id = button.attr('id');
			var aside = button.parents('aside');
			var id = aside.attr('id');
            var answer = button.prev().val();
			
			var q = new Question(id, answer);
			q.save();						
			//aside.remove(); 
			showAnswer(id, aside);						
        });    

		function showAnswer(id, aside) {
			var answerText = storageWrapper.GetFromLocal(id);
			
			if(!answerText) 
				return;
			
			var resolver = new AnswerResolver(id, answerText);		
			var result = $('<p>').append($('<mark>').text(resolver.text));
			aside.find('blockquote p').append(result);
			aside.find('.wrapper').remove();			
		}	
		
		function AnswerResolver(id, answerText) {			
			this.text = resolvAnswer(id, answerText);
			
			function resolvAnswer(id, answerText) {								
				if(id == NEWTOWNSECONLAW_ID){
					var rightAnser = 0.8;
					var userAnswer = parseFloat(answerText.replace(',', '.'));
					return getAnswerText(userAnswer, rightAnser);		
				} else if(id == CHANCE_ID) {
					var rightAnser = 1;
					var userAnswer = parseInt(answerText);
					return getAnswerText(userAnswer, rightAnser);	
				} else if(id == WAVELIKE_ID) {
					var rightAnser = 'нет';
					var userAnswer = answerText;
					return getAnswerText(userAnswer, rightAnser);	
				}				 
			};
			
			function getAnswerText(userAnswer, rightAnser) {
				if(userAnswer == rightAnser) {
					return '"' + answerText + '" это правильный ответ';
				} else {
					return 'Это не правильный ответ, правильный ответ ' + rightAnser;
				}			
			}			
		}	
		
		///////////////////////////////////////
        //Question View Data		
		function QuestionTemplate() {
			this.id = '';
			this.title = '';
			this.subtitle = '';
			this.text = '';
		}
		
		function getQuestionByPageId(id) {
			var q = new QuestionTemplate();
			if(id == FIRST_PAGE_ID) {
				q.id = '#newtownSecondLaw';
				q.title = 'Задача 1 :';
				q.subtitle = ' Второй закон Ньютона';
				q.text = 'Хозяйка бросила коту 0,04 кг колбасы с ускорением 2 м/с. Какое ускорение приобретет сосиска массой 0,1 кг, брошенная Коту с той же силой?';
				
				
			} else if(id == OPERADOR_PAGE_ID) {
				q.id = '#cambiar';
				q.title = 'Задача 2 :';
				q.subtitle = ' Закончите решение и ответьте, чему же равен коммутатор.';
				q.text = 'Итак, существуют ли координата и импульс в квантовом мире одновременно?';
				
				
			} else if(id == WAVE_FUNCTION_PAGE_ID) {
				q.id = '#chance';
				q.title = 'Вопрос 1 :';
				q.subtitle = '';
				q.text = 'Чему равна вероятность найти Кота где-либо во всем пространстве?';			
			
			
			} else if(id == TWO_SLITS_PAGE_ID) {
				q.id = '#waveLike';
				q.title = 'Вопрос 2 :';
				q.subtitle = '';
				q.text = 'Мы будем наблюдать за обеими щелями. Будет ли Кот проявлять волновые свойства в этом случае пробираясь через забор?';
			} 			
			
			createQuestion(q);
		}
		
		function createQuestion(q) {
			var template = $.trim ( $('#questionTemplate').html() );
			var result = template.replace( /{{title}}/ig , q.title )
				.replace( /{{subtitle}}/ig , q.subtitle )
				.replace( /{{text}}/ig , q.text);
			
			$(q.id).append(result);			
		}
})(jQuery)