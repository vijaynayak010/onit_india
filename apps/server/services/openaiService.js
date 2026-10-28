import OpenAI from 'openai';

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
    
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  }


  /**
   * Build the system prompt that enforces JSON output format
   */
  buildSystemPrompt() {
    return `You are a task generation assistant for OnIT India, a task marketplace platform.
Your job is to convert natural language task descriptions into structured JSON.

STRICT REQUIREMENTS:
1. Return ONLY valid JSON, no additional text
2. Use exactly this structure: {title, description, skills, budget_range, estimated_time, task_category, clarification_questions}
3. title: 10-100 characters, clear and specific
4. description: 50-1000 characters, detailed and actionable
5. skills: array of 2-8 relevant skills
6. budget_range: format as "₹{min}-₹{max}" in Indian Rupees
7. estimated_time: human-readable (e.g., "2-4 hours", "1-2 days")
8. task_category: MUST be one of: Development, Design, Marketing, Research, Content, Admin, Local Assistance, Academic Support
9. clarification_questions: array of 1-5 questions if prompt is vague, empty array if clear

ESTIMATION GUIDELINES:
- Simple tasks: ₹500-₹2000, 1-4 hours
- Medium tasks: ₹2000-₹5000, 1-3 days
- Complex tasks: ₹5000-₹15000, 3-7 days
- Very complex: ₹15000+, 1-4 weeks

Return ONLY the JSON object, no markdown formatting, no explanations.`;
  }

  /**
   * Parse and correct common JSON formatting issues
   */
  parseAndCorrectJSON(text) {
    try {
      // Try direct parse first
      return JSON.parse(text);
    } catch (e) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Try to find JSON object in the text
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        return JSON.parse(objectMatch[0]);
      }
      
      throw new Error('Could not extract valid JSON from response');
    }
  }

  /**
   * Validate the OpenAI response structure
   */
  validateResponse(data) {
    const required = ['title', 'description', 'skills', 'budget_range', 'estimated_time', 'task_category', 'clarification_questions'];
    
    for (const field of required) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    return data;
  }

  /**
   * Generate a structured task from a natural language prompt
   */
  async generateTask(prompt) {
    try {
      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Prompt cannot be empty');
      }

      if (prompt.length > 2000) {
        throw new Error('Prompt exceeds maximum length of 2000 characters');
      }

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0].message.content;
      
      // Parse the JSON response
      const parsedData = this.parseAndCorrectJSON(responseText);
      
      // Validate the response structure
      const validatedData = this.validateResponse(parsedData);
      
      return validatedData;
    } catch (error) {
      console.error('OpenAI Service Error:', error);
      
      // Re-throw with more context
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API authentication failed');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded');
      } else if (error.message.includes('JSON')) {
        throw new Error('Failed to parse AI response');
      }
      
      throw error;
    }
  }

  /**
   * Enhance a project description using AI
   */
  async enhanceDescription(description, productType) {
    try {
      if (!description || description.trim().length === 0) {
        throw new Error('Description cannot be empty');
      }

      const systemPrompt = `You are a professional project description enhancer for OnIT India.
Your job is to improve project descriptions to be more detailed, clear, and professional.

Guidelines:
1. Keep the original intent and meaning
2. Add specific details and requirements
3. Make it more actionable for specialists
4. Include relevant technical or design considerations
5. Keep it concise but comprehensive (150-300 words)
6. Return ONLY the enhanced description, no additional text`;

      const userPrompt = `Enhance this ${productType} project description to be more detailed and professional:

"${description}"

Return only the enhanced description.`;

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const enhanced = completion.choices[0].message.content.trim();
      return enhanced;
    } catch (error) {
      console.error('Enhance Description Error:', error);
      throw error;
    }
  }
}

export default OpenAIService;
