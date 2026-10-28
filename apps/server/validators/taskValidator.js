import Joi from 'joi';

class TaskValidator {
  static TASK_CATEGORIES = [
    'Development',
    'Design',
    'Marketing',
    'Research',
    'Content',
    'Admin',
    'Local Assistance',
    'Academic Support'
  ];

  /**
   * Joi schema for generated task validation
   */
  static getTaskSchema() {
    return Joi.object({
      title: Joi.string()
        .min(10)
        .max(100)
        .required()
        .messages({
          'string.min': 'Title must be at least 10 characters',
          'string.max': 'Title must not exceed 100 characters',
          'any.required': 'Title is required'
        }),
      
      description: Joi.string()
        .min(50)
        .max(1000)
        .required()
        .messages({
          'string.min': 'Description must be at least 50 characters',
          'string.max': 'Description must not exceed 1000 characters',
          'any.required': 'Description is required'
        }),
      
      skills: Joi.array()
        .items(Joi.string().min(2).max(30))
        .min(2)
        .max(8)
        .required()
        .messages({
          'array.min': 'At least 2 skills are required',
          'array.max': 'Maximum 8 skills allowed',
          'any.required': 'Skills are required'
        }),
      
      budget_range: Joi.string()
        .pattern(/^₹\d+-₹\d+$/)
        .required()
        .messages({
          'string.pattern.base': 'Budget range must be in format ₹{min}-₹{max}',
          'any.required': 'Budget range is required'
        }),
      
      estimated_time: Joi.string()
        .min(1)
        .required()
        .messages({
          'string.min': 'Estimated time cannot be empty',
          'any.required': 'Estimated time is required'
        }),
      
      task_category: Joi.string()
        .valid(...TaskValidator.TASK_CATEGORIES)
        .required()
        .messages({
          'any.only': `Task category must be one of: ${TaskValidator.TASK_CATEGORIES.join(', ')}`,
          'any.required': 'Task category is required'
        }),
      
      clarification_questions: Joi.array()
        .items(Joi.string().min(10).max(200))
        .max(5)
        .required()
        .messages({
          'array.max': 'Maximum 5 clarification questions allowed',
          'any.required': 'Clarification questions field is required'
        })
    });
  }

  /**
   * Validate a generated task object
   */
  static validate(data) {
    const schema = TaskValidator.getTaskSchema();
    const { error, value } = schema.validate(data, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return {
        isValid: false,
        errors,
        sanitizedData: null
      };
    }
    
    return {
      isValid: true,
      errors: [],
      sanitizedData: value
    };
  }

  /**
   * Validate title field
   */
  static validateTitle(title) {
    if (typeof title !== 'string') return false;
    return title.length >= 10 && title.length <= 100;
  }

  /**
   * Validate description field
   */
  static validateDescription(description) {
    if (typeof description !== 'string') return false;
    return description.length >= 50 && description.length <= 1000;
  }

  /**
   * Validate skills array
   */
  static validateSkills(skills) {
    if (!Array.isArray(skills)) return false;
    if (skills.length < 2 || skills.length > 8) return false;
    return skills.every(skill => 
      typeof skill === 'string' && skill.length >= 2 && skill.length <= 30
    );
  }

  /**
   * Validate budget range format
   */
  static validateBudgetRange(budget) {
    if (typeof budget !== 'string') return false;
    return /^₹\d+-₹\d+$/.test(budget);
  }

  /**
   * Validate estimated time
   */
  static validateEstimatedTime(time) {
    if (typeof time !== 'string') return false;
    return time.length > 0;
  }

  /**
   * Validate task category
   */
  static validateCategory(category) {
    return TaskValidator.TASK_CATEGORIES.includes(category);
  }

  /**
   * Validate clarification questions
   */
  static validateClarificationQuestions(questions) {
    if (!Array.isArray(questions)) return false;
    if (questions.length > 5) return false;
    return questions.every(q => 
      typeof q === 'string' && q.length >= 10 && q.length <= 200
    );
  }

  /**
   * Sanitize input prompt
   */
  static sanitizePrompt(prompt) {
    if (typeof prompt !== 'string') return '';
    
    // Remove potential injection attempts
    return prompt
      .trim()
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .substring(0, 2000);
  }
}

export default TaskValidator;
