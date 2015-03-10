from django.db import models
from django.contrib.auth.models import User

class Stat(models.Model):
	user = models.ForeignKey(User)
	game_engine = models.CharField(max_length = 60)
	wins = models.IntegerField(default = 0)
	losses = models.IntegerField(default = 0)
	ties = models.IntegerField(default = 0)

	def total_games(self):
		return self.wins + self.ties + self.losses

	def win_ratio(self):
		if self.total_games() == 0:
			return 0
		return self.wins*1./self.total_games()

	def loss_ratio(self):
		if self.total_games() == 0:
			return 0
		return self.losses*1./self.total_games()
