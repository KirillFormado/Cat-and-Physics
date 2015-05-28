(function (window, $) {
		var page = {
			//constants
			var CLASSIC_MODE = 'classicMode',
				INTERACTIVE_MODE = 'interactiveMode',
				SITE_MODE_KEY = 'siteMode',
				QUESTION_LIST_ANSWERS = 'questionListAnswers',	
				//Page id constants
				SELECT_MODE_PAGE_ID = '#selectModePage',
				FIRST_PAGE_ID = '#classicAndQuant',
				OPERADOR_PAGE_ID = '#operador',
				WAVE_FUNCTION_PAGE_ID = '#waveFunction',
				TWO_SLITS_PAGE_ID = '#twoSlits',
				END_PAGE_ID = '#results',
				//question id constants 
				NEWTOWNSECONLAW_ID = 'newtownSecondLaw',
				CAMBIAR_ID = 'cambiar',
				CHANCE_ID = 'chance',
				WAVELIKE_ID = 'waveLike';
				
			var storageWrapper = new StorageWrapper(),		
				mode = storageWrapper.GetFromSession(SITE_MODE_KEY),			
				content = $('#content'),
				location = window.location,
				document = window.document;
			
			///////////////////////////////////////
			// page handlers	
			load = function () {
				$('section').hide();		
				
				if (mode === undefined) {
					hideMenu();
					loadContent(SELECT_MODE_PAGE_ID, content);
				} else {
					selectSiteMode(mode, content);			
				}		   
				
				///////////////////////////////////////
				// site mode handlers		  
				
				//classical mode set
				$(document).on('click', '#classicalStart', function () {			
					storageWrapper.PutInSession(SITE_MODE_KEY, CLASSIC_MODE);	
					mode = storageWrapper.GetFromSession(SITE_MODE_KEY);
					firstPageLoad();
				});	
				
				//interactive mode set	
				$(document).on('click', '#interactiveStart', function() {
					storageWrapper.PutInSession(SITE_MODE_KEY, INTERACTIVE_MODE);
					mode = storageWrapper.GetFromSession(SITE_MODE_KEY);
					firstPageLoad();
				});
				
				function selectSiteMode(mode, content) {
					var h = location.hash;			
					if(h) {
						loadContent(h, content);
					} else {
						loadContent(FIRST_PAGE_ID, content);
					}
				}	 	
				
				function loadContent(pageId, content) {
					$(pageId).clone().appendTo(content).hide().fadeIn();			
					if(mode == INTERACTIVE_MODE) {
						hideMenu();
						getQuestionByPageId(pageId);
						if(pageId != END_PAGE_ID) {
							getNextPageButtonByPageId(pageId, content);
						}
					}				
				}		
				
				function firstPageLoad() {			
					pageLoad(FIRST_PAGE_ID);
				}
				
				function pageLoad(pageId) {
					content.children().fadeOut('fast', function() {
						content.empty();
						loadContent(pageId, content);					
					});				
				}	
				
				///////////////////////////////////////
				// Menu Hanlers
				$(document).on('click', '.nav a', function () {
					var pageId = $(this).attr('href');
					pageLoad(pageId);			
				});
				
				function hideMenu() {
					$('.navbar-inner').children().hide();
				}
			}
			
			
			///////////////////////////////////////
			// Next Page Button
			function getNextPageButtonByPageId(currentPageId, content) {
				var nextPageId = '';
				if(currentPageId == FIRST_PAGE_ID) {
					nextPageId = OPERADOR_PAGE_ID;
					
					
				} else if(currentPageId == OPERADOR_PAGE_ID) {
					nextPageId = WAVE_FUNCTION_PAGE_ID;
					
					
				} else if(currentPageId == WAVE_FUNCTION_PAGE_ID) {
					nextPageId = TWO_SLITS_PAGE_ID ;
					
					
				} else if(currentPageId == TWO_SLITS_PAGE_ID) {
					nextPageId = END_PAGE_ID;
				}
			
				createNextPageButton(nextPageId, content);
			}
			
			function createNextPageButton(id, content) {
				var template = $.trim ( $('#nextPageButtonIdTemplate').html() );
				var result = template.replace( /{{nextPageId}}/ig , id );
				content.append(result);			
			}
			
			//next page button click
			$(document).on('click', '.nextPageButton', function() {
				var button = $(this);
				var nextPageId = button.data('nextPageId');
				//location.hash = nextPageId;
				pageLoad(nextPageId);
			});
			
			
			///////////////////////////////////////
			//storage wrapper		
			function StorageWrapper() {
				this.PutInSession = function (key, value) {
					sessionStorage[key] = value;
				};
				
				this.GetFromSession = function (key) {
					return sessionStorage[key];
				};
				
				this.PutInLocal = function (key, value) {
					localStorage[key] = value;
				};
				
				this.GetFromLocal = function (key) {
					return localStorage[key];
				};			
			}
			
			  ///////////////////////////////////////
			//questions handlers
			function Question(id, answer) {
				this.id = id;
				this.answer = answer;
				this.save = function () {
					storageWrapper.PutInLocal(id, answer);				
				};
			}
			
			$(document).on('click', '.answerButton', function () {
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
		};		
    
})(window, jQuery );
