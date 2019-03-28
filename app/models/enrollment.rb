class Enrollment < ActiveRecord::Base
	belongs_to :user
	belongs_to :course
	validates :course_type, presence: true

	
	scope :classroom, -> { where(course_type: "classroom") }
	scope :online, -> { where(course_type: "online") }


	scope :online_courses, -> (courseid) { online.where("course_id == ? ", courseid)}
	scope :classroom_courses, -> (courseid) { classroom.where("course_id == ? ", courseid)}



	def course_id_check
		course = Course.id_check(self.course_id)
			if course == []
				false
			else
				true
			end
	end

end