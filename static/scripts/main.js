(function (window, $) {    
        //constants
        var CLASSIC_MODE = 'classicMode',
			INTERACTIVE_MODE = 'interactiveMode',
			SITE_MODE_KEY = 'siteMode',
			QUESTION_LIST_ANSWERS = 'questionListAnswers',	
			//Page id constants
			HEADER_ID = '#header',
			SELECT_MODE_PAGE_ID = '#selectModePage',
			FIRST_PAGE_ID = '#classicAndQuant',
			OPERADOR_PAGE_ID = '#operador',
			WAVE_FUNCTION_PAGE_ID = '#waveFunction',
			TWO_SLITS_PAGE_ID = '#twoSlits',
			GOD_PLAY_DICE_ID = '#godPlaysDice',
			END_PAGE_ID = '#results',
			//question id constants 
			NEWTOWNSECONLAW_ID = 'newtownSecondLaw',
			CAMBIAR_ID = 'cambiar',
			CHANCE_ID = 'chance',
			WAVELIKE_ID = 'waveLike',
			UNLIKECHARGES_ID = 'unlikeCharges';
			
        var storageWrapper = new StorageWrapper(),		
			mode = storageWrapper.GetFromSession(SITE_MODE_KEY),			
			content = $('#content'),
			location = window.location,
			document = window.document;
		
		///////////////////////////////////////
        // page handlers		        
        $('section').hide();		
		
		$(HEADER_ID).on('click', function() { 
			storageWrapper.ClearStorage(); 
			goToSiteRoot();
		});
		
        if (isModeEmpty(mode)) {
			hideMenu();
            loadContent(SELECT_MODE_PAGE_ID, content);    			
        } else {	
			selectSiteMode(mode, content);		        	
        }		   
		
		function isModeEmpty(mode) {
			return mode === undefined || mode === null || mode === "";
		}
		
		function goToSiteRoot() {
			window.document.location = '/';
		}
		
		
		///////////////////////////////////////
        // site mode handlers		  
		
		//TODO: classical and interectve events very similar
        //classical mode set
        $(document).on('click', '#classicalStart', function () {			
            storageWrapper.PutInSession(SITE_MODE_KEY, CLASSIC_MODE);	
			mode = storageWrapper.GetFromSession(SITE_MODE_KEY);
			//TODO: Refactor this
				$('.navbar-inner').children().show();
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
				window.scrollTo(0, 0);
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
				nextPageId = GOD_PLAY_DICE_ID;
				
				
			} else if(currentPageId == GOD_PLAY_DICE_ID) {
				nextPageId = END_PAGE_ID
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
			this.ClearStorage = function () {
				sessionStorage.clear();
			}
        }
		
		
		  ///////////////////////////////////////
        //questions handlers
        function Question(id, answer) {
            this.id = id;
            this.answer = answer.trim();
            this.save = function () {
                storageWrapper.PutInLocal(this.id, this.answer);				
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
					var rightAnswer = 0.8;
					var userAnswer = parseFloat(answerText.replace(',', '.'));
					return getAnswerText(userAnswer, rightAnswer);	
					
				} else if(id == CAMBIAR_ID) {
					var rightAnswer = 0;
					var userAnswer = parseInt(answerText);
					return getAnswerText(userAnswer, rightAnswer);			
					
				} else if(id == CHANCE_ID) {
					var rightAnser = 1;
					var userAnswer = parseInt(answerText);
					return getAnswerText(userAnswer, rightAnswer);	
					
				} else if(id == WAVELIKE_ID) {
					var rightAnswer = 'нет';
					var userAnswer = answerText;
					return getAnswerText(userAnswer, rightAnswer);		
					
				} else if(id == 	UNLIKECHARGES_ID) {
					var rightAnswer = 'притягиваются';
					var userAnswer = answerText;
					return getAnswerText(userAnswer, rightAnswer);
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
			var qArray = [];
			q = new QuestionTemplate();
			if(id == FIRST_PAGE_ID) {
				q.id = '#newtownSecondLaw';
				q.title = 'Задача 1 :';
				q.subtitle = ' Второй закон Ньютона';
				q.text = 'Хозяйка бросила коту 0,04 кг колбасы с ускорением 2 м/с. Какое ускорение приобретет сосиска массой 0,1 кг, брошенная Коту с той же силой?';				
				qArray = [q];
				
			} else if(id == OPERADOR_PAGE_ID) {
				q.id = '#cambiar';
				q.title = 'Задача 2 :';
				q.subtitle = ' Закончите решение и ответьте, чему же равен коммутатор.';
				q.text = 'Чему равен коммутатор оператора координаты и оператора проекции импульса на другую координату [x^,p^y]?';
				qArray = [q];
				
			} else if(id == WAVE_FUNCTION_PAGE_ID) {
				q.id = '#chance';
				q.title = 'Вопрос 1 :';
				q.subtitle = '';
				q.text = 'Чему равна вероятность найти Кота где-либо во всем пространстве?';						
				qArray = [q];
			
			} else if(id == TWO_SLITS_PAGE_ID) {
				q.id = '#waveLike';
				q.title = 'Вопрос 2 :';
				q.subtitle = '';
				q.text = 'Мы будем наблюдать за обеими щелями. Будет ли Кот проявлять волновые свойства в этом случае пробираясь через забор?';
				qArray = [q];
				
			} else if(id == GOD_PLAY_DICE_ID) {
				q.id = '#unlikeCharges';
				q.title = 'Вопрос 2 :';
				q.subtitle = 'Подумайте, как ведут себя разноименное заряды?';
				q.text = 'притягиваются, отталкиваются или нейтрально';	
				qArray = [q];
				
			}			
			
			createQuestion(qArray);
		}
		
		function createQuestion(qArray) {
			for(var i = 0; qArray.length > i; i++) {
				var q = qArray[i];
				var template = $.trim ( $('#questionTemplate').html() );
				var result = template.replace( /{{title}}/ig , q.title )
					.replace( /{{subtitle}}/ig , q.subtitle )
					.replace( /{{text}}/ig , q.text);
				
				$(q.id).append(result);	
			}			
		}
		
    
})(window, jQuery );