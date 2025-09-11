import nodemailer from "nodemailer"

interface Task {
  title: string
  description?: string
  dueDate?: Date
  priority: string
  assignedBy?: string
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Send task assignment email
export async function sendTaskAssignedEmail(userEmail: string, task: Task) {
  const transporter = createTransporter()
  
  const priorityColors = {
    low: "#10B981", // green
    medium: "#F59E0B", // yellow
    high: "#F97316", // orange
    urgent: "#EF4444", // red
  }
  
  const priorityColor = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium
  
  const dueDateText = task.dueDate 
    ? `Due Date: ${task.dueDate.toLocaleDateString()}`
    : "No due date set"
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Task Assigned</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .task-card { background: white; border-left: 4px solid ${priorityColor}; padding: 20px; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .priority-badge { display: inline-block; background: ${priorityColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 New Task Assigned</h1>
          <p>You have been assigned a new task in PlanIT</p>
        </div>
        
        <div class="content">
          <div class="task-card">
            <h2 style="margin-top: 0; color: #333;">${task.title}</h2>
            ${task.description ? `<p style="color: #666; margin-bottom: 15px;">${task.description}</p>` : ''}
            
            <div style="margin-bottom: 15px;">
              <span class="priority-badge">${task.priority}</span>
            </div>
            
            <p style="color: #666; margin-bottom: 10px;">
              <strong>${dueDateText}</strong>
            </p>
            
            ${task.assignedBy ? `<p style="color: #666; font-size: 14px;">Assigned by: ${task.assignedBy}</p>` : ''}
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
              View Task in PlanIT
            </a>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from PlanIT Task Management System.</p>
            <p>If you have any questions, please contact your administrator.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
  
  const textContent = `
New Task Assigned

Task: ${task.title}
${task.description ? `Description: ${task.description}` : ''}
Priority: ${task.priority}
${dueDateText}
${task.assignedBy ? `Assigned by: ${task.assignedBy}` : ''}

View your task at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard
  `
  
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: userEmail,
    subject: `New Task Assigned: ${task.title}`,
    text: textContent,
    html: htmlContent,
  }
  
  try {
    await transporter.sendMail(mailOptions)
    console.log(`Task assignment email sent to ${userEmail}`)
  } catch (error) {
    console.error("Failed to send task assignment email:", error)
    throw error
  }
}
