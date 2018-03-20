// = require ./auto_label_by_position.component
// = require ./auto_buttons_by_position.component
// = require ./dynamic_fields.component

((exports) => {
  const { AutoLabelByPositionComponent, AutoButtonsByPositionComponent, createDynamicFields, createSortList } = exports.DecidimAdmin;

  const wrapperSelector = '.survey-questions';
  const fieldSelector = '.survey-question';
  const questionTypeSelector = 'select[name$=\\[question_type\\]]';
  const answerOptionsWrapperSelector = '.survey-question-answer-options';

  const autoLabelByPosition = new AutoLabelByPositionComponent({
    listSelector: '.survey-question:not(.hidden)',
    labelSelector: '.card-title span:first',
    onPositionComputed: (el, idx) => {
      $(el).find('input[name$=\\[position\\]]').val(idx);
    }
  });

  const autoButtonsByPosition = new AutoButtonsByPositionComponent({
    listSelector: '.survey-question:not(.hidden)',
    hideOnFirstSelector: '.move-up-question',
    hideOnLastSelector: '.move-down-question'
  });

  const createSortableList = () => {
    createSortList('.survey-questions-list:not(.published)', {
      handle: '.question-divider',
      placeholder: '<div style="border-style: dashed; border-color: #000"></div>',
      forcePlaceholderSize: true,
      onSortUpdate: () => { autoLabelByPosition.run() }
    });
  };

  const createDynamicFieldsForAnswerOptions = (fieldId) => {
    createDynamicFields({
      placeholderId: `survey-question-answer-option-id`,
      wrapperSelector: `#${fieldId} ${answerOptionsWrapperSelector}`,
      containerSelector: `.survey-question-answer-options-list`,
      fieldSelector: `.survey-question-answer-option`,
      addFieldButtonSelector: `.add-answer-option`,
      removeFieldButtonSelector: `.remove-answer-option`
    });
  };

  const setAnswerOptionsWrapperVisibility = ($target) => {
    const $answerOptionsWrapper = $target.parents(fieldSelector).find(answerOptionsWrapperSelector);
    const value = $target.val();

    $answerOptionsWrapper.hide();

    if (value === 'single_option' || value === 'multiple_option') {
      $answerOptionsWrapper.show();
    }
  };

  createDynamicFields({
    placeholderId: 'survey-question-id',
    wrapperSelector: wrapperSelector,
    containerSelector: '.survey-questions-list',
    fieldSelector: fieldSelector,
    addFieldButtonSelector: '.add-question',
    removeFieldButtonSelector: '.remove-question',
    moveUpFieldButtonSelector: '.move-up-question',
    moveDownFieldButtonSelector: '.move-down-question',
    onAddField: ($field) => {
      const fieldId = $field.attr('id');

      createSortableList();
      autoLabelByPosition.run();
      autoButtonsByPosition.run();
      createDynamicFieldsForAnswerOptions(fieldId);
      setAnswerOptionsWrapperVisibility($field.find(questionTypeSelector));
    },
    onRemoveField: () => {
      autoLabelByPosition.run();
      autoButtonsByPosition.run();
    },
    onMoveUpField: () => {
      autoLabelByPosition.run();
      autoButtonsByPosition.run();
    },
    onMoveDownField: () => {
      autoLabelByPosition.run();
      autoButtonsByPosition.run();
    }
  });

  createSortableList();

  $(fieldSelector).each((idx, el) => {
    createDynamicFieldsForAnswerOptions($(el).attr('id'));
    setAnswerOptionsWrapperVisibility($(el).find(questionTypeSelector));
  });

  $(wrapperSelector).on('change', questionTypeSelector, (ev) => {
    const $target = $(ev.target);
    setAnswerOptionsWrapperVisibility($target);
  });
})(window);
